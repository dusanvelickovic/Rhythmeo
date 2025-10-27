import {inject, Injectable, NgZone} from '@angular/core';
import { BehaviorSubject, Observable, fromEvent } from 'rxjs';
import { AuthService } from './auth.service';
import {Track} from '../types/track';

export interface PlayerState {
    paused: boolean;
    position: number;
    duration: number;
    current_track: Track | null;
    nextTracks: [];
    previousTracks: [];
}

@Injectable({
    providedIn: 'root',
})
export class SpotifyPlayerService {
    private player: Spotify.Player | null = null;
    private deviceId: string | null = null;

    private playerStateSubject = new BehaviorSubject<PlayerState>({
        paused: true,
        position: 0,
        duration: 0,
        current_track: null,
        nextTracks: [],
        previousTracks: [],
    });

    public playerState$: Observable<PlayerState> = this.playerStateSubject.asObservable();

    private readySubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public ready$: Observable<boolean> = this.readySubject.asObservable();

    constructor(
        private readonly authService: AuthService,
        private readonly ngZone: NgZone,
    ) {}

    /**
     * Initialize the Spotify Player
     */
    async initializePlayer(): Promise<void> {
        console.log('Initializing Spotify Player');

        return new Promise((resolve, reject) => {
            if (!window.Spotify) {
                reject('Spotify SDK not loaded');
                return;
            }

            this.authService.getSpotifyAccessToken().then((accessToken) => {
                if (!accessToken) {
                    reject('No access token');
                    return;
                }

                // Instantiate the player
                this.player = new window.Spotify.Player({
                    name: 'Spotify Angular Player',
                    getOAuthToken: (callback) => {
                        callback(accessToken);
                    },
                    volume: 0.5,
                });

                // Error handling
                this.player.addListener('initialization_error', ({message}) => {
                    console.error('Initialization Error:', message);
                    reject(message);
                });

                this.player.addListener('authentication_error', ({message}) => {
                    console.error('Authentication Error:', message);
                    reject(message);
                });

                this.player.addListener('account_error', ({message}) => {
                    console.error('Account Error:', message);
                    reject(message);
                });

                this.player.addListener('playback_error', ({message}) => {
                    console.error('Playback Error:', message);
                });

                // Wait for the player to be ready
                this.player.addListener('ready', ({device_id}) => {
                    this.ngZone.run(() => {
                        console.log('Spotify Player Ready: ', device_id);

                        this.deviceId = device_id;
                        this.readySubject.next(true);
                        resolve();
                    });
                });

                // Player not ready
                this.player.addListener('not_ready', ({device_id}) => {
                    this.ngZone.run(() => {
                        this.readySubject.next(false);
                    });
                });

                // State promene
                this.player.addListener('player_state_changed', (state) => {
                    this.ngZone.run(() => {
                        if (!state) return;

                        this.playerStateSubject.next({
                            paused: state.paused,
                            position: state.position,
                            duration: state.duration,
                            current_track: state.track_window.current_track,
                            nextTracks: state.track_window.next_tracks,
                            previousTracks: state.track_window.previous_tracks,
                        });
                    });
                });

                // Connect the player
                this.player.connect().then((success) => {
                    if (success) {
                        console.log('The Web Playback SDK successfully connected to Spotify!');
                    }
                });

            }).catch((error) => {
                reject('Failed to get access token: ' + error);
            });
        });
    }

    /**
     * Play the song
     */
    async play(spotifyUri?: string): Promise<void> {
        const deviceId = this.getDeviceId();

        console.log('Device ID:', deviceId);

        if (!deviceId) {
            throw new Error('Device not ready');
        }

        this.authService.getSpotifyAccessToken().then(async (accessToken: string | null) => {
            const body: any = {};

            if (spotifyUri) {
                if (spotifyUri.includes('track')) {
                    body.uris = [spotifyUri];
                } else {
                    body.context_uri = spotifyUri;
                }
            }

            const response = await fetch(
                `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(body),
                }
            );

            console.log(response);

            if (!response.ok) {
                throw new Error('Failed to play');
            }
        }).catch((error) => {
            throw new Error('Failed to get access token: ' + error);
        })
    }

    /**
     * Pause playback
     */
    async pause(): Promise<void> {
        if (this.player) {
            await this.player.pause();
        }
    }

    /**
     * Resume playback
     */
    async resume(): Promise<void> {
        if (this.player) {
            await this.player.resume();
        }
    }

    /**
     * Toggle play/pause
     */
    async togglePlay(): Promise<void> {
        if (this.player) {
            await this.player.togglePlay();
        }
    }

    /**
     * Go to next track
     */
    async nextTrack(): Promise<void> {
        if (this.player) {
            await this.player.nextTrack();
        }
    }

    /**
     * Go to previous track
     */
    async previousTrack(): Promise<void> {
        if (this.player) {
            await this.player.previousTrack();
        }
    }

    /**
     * Seek to position
     */
    async seek(positionMs: number): Promise<void> {
        if (this.player) {
            await this.player.seek(positionMs);
        }
    }

    /**
     * Set the volume (0.0 to 1.0)
     */
    async setVolume(volume: number): Promise<void> {
        if (this.player) {
            await this.player.setVolume(volume);
        }
    }

    /**
     * Get the current playback state
     */
    async getCurrentState(): Promise<Spotify.PlaybackState | null> {
        if (this.player) {
            return await this.player.getCurrentState();
        }
        return null;
    }

    /**
     * Get the current device ID
     */
    getDeviceId(): string | null {
        return this.deviceId;
    }

    /**
     * Reset the player state to default values
     */
    cleanUpPlayerState(): void {
        this.playerStateSubject.next({
            paused: true,
            position: 0,
            duration: 0,
            current_track: null,
            nextTracks: [],
            previousTracks: [],
        });
    }

    /**
     * Disconnect the Spotify Player
     */
    disconnect(): void {
        if (this.player) {
            this.player.disconnect();
            this.player = null;
            this.deviceId = null;
            this.readySubject.next(false);
        }
    }
}
