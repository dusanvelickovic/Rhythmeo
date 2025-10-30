import {Component, Input, OnDestroy, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, signal, HostListener} from '@angular/core';
import {interval, Subject, takeUntil, Observable, merge} from 'rxjs';
import {map} from 'rxjs/operators';
import {Track} from '../../core/types/track';
import { Store } from '@ngrx/store';
import * as PlayerActions from '../../store/player/player.actions';
import * as PlayerSelectors from '../../store/player/player.selectors';
import { PlayerState } from '../../store/player/player.state';
import * as LikedTracksActions from '../../store/liked-tracks/liked-tracks.actions';
import * as LikedTracksSelectors from '../../store/liked-tracks/liked-tracks.selectors';
import { AddToPlaylist } from '../add-to-playlist/add-to-playlist';

@Component({
  selector: 'app-spotify-player',
  imports: [AddToPlaylist],
  templateUrl: './spotify-player.html',
  styleUrl: './spotify-player.css'
})
export class SpotifyPlayer implements OnInit, OnChanges, OnDestroy{
    @Input() track: Track|null = null;
    @Input() nextTrackUri: string|null = null;
    @Input() previousTrackUri: string|null = null;
    @Output() nextTrackRequested = new EventEmitter<void>();
    @Output() previousTrackRequested = new EventEmitter<void>();

    private destroy$ = new Subject<void>();
    public showVolumeSlider = signal(false);
    public showAddToPlaylist = signal(false);

    playerState$!: Observable<PlayerState>;
    isReady$!: Observable<boolean>;
    volume$!: Observable<number>;
    isLiked$!: Observable<boolean>;

    playerState: PlayerState | null = null;
    isReady = false;
    volume = 20;
    isLiked = false;

    constructor(private store: Store) {
        this.playerState$ = this.store.select(PlayerSelectors.selectPlayerState);
        this.isReady$ = this.store.select(PlayerSelectors.selectIsReady);
        this.volume$ = this.store.select(PlayerSelectors.selectVolume);
    }

    /**
     * Toggle volume slider visibility
     */
    toggleVolumeSlider(): void {
        this.showVolumeSlider.set(!this.showVolumeSlider());
    }

    /**
     * Close volume slider on outside click
     */
    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        const volumeControl = target.closest('.volume-control-container');

        if (!volumeControl && this.showVolumeSlider()) {
            this.showVolumeSlider.set(false);
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        // Update liked status selector when track changes
        if (changes['track'] && changes['track'].currentValue) {
            this.updateLikedStatusObservable();

            // Check if the track URI actually changed from previous value
            const previousTrack = changes['track'].previousValue;
            const currentTrack = changes['track'].currentValue;
            const trackChanged = !previousTrack || previousTrack.uri !== currentTrack.uri;

            // Only auto-play if it's a different track
            if (trackChanged) {
                // Check player state from store directly since local playerState may not be initialized yet
                this.playerState$.pipe(
                    takeUntil(this.destroy$)
                ).subscribe(state => {
                    // If there was a track playing before AND it's a different track from what's in the store
                    if (state?.current_track && !state.paused && state.current_track.uri !== currentTrack.uri) {
                        this.songWasPlayed = true;
                        this.store.dispatch(PlayerActions.play({ uri: currentTrack.uri }));
                    }
                }).unsubscribe();
            }
        }
    }

    async ngOnInit(): Promise<void> {
        // Load liked tracks on init
        this.store.dispatch(LikedTracksActions.loadLikedTracks());

        // Merge player-related store selectors into a single subscription
        merge(
            this.playerState$.pipe(
                map(state => ({ type: 'state' as const, data: state }))
            ),
            this.isReady$.pipe(
                map(ready => ({ type: 'ready' as const, data: ready }))
            ),
            this.volume$.pipe(
                map(volume => ({ type: 'volume' as const, data: volume }))
            )
        ).pipe(
            takeUntil(this.destroy$)
        ).subscribe(result => {
            if (result.type === 'state') {
                this.playerState = result.data;
                
                // If the current track in store matches our track and is playing, mark as played
                if (this.playerState?.current_track?.uri === this.track?.uri && !this.playerState.paused) {
                    this.songWasPlayed = true;
                }
            } else if (result.type === 'ready') {
                this.isReady = result.data;
            } else if (result.type === 'volume') {
                this.volume = result.data;
            }
        });

        // Set up liked status observable
        if (this.track?.id) {
            this.updateLikedStatusObservable();
        }

        // Update position every second
        interval(1000)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                if (this.playerState && !this.playerState.paused) {
                    const newPosition = Math.min(
                        this.playerState.position + 1000,
                        this.playerState.duration
                    );
                    this.store.dispatch(PlayerActions.updatePosition({ position: newPosition }));
                }
            });
    }

    private songWasPlayed = false;
    togglePlay(): void {
        try {
            // If the song was never played, play it from the beginning
            // TODO: ugly fix
            if (!this.songWasPlayed) {
                // Mark as played
                this.songWasPlayed = true;

                // Play the track
                this.store.dispatch(PlayerActions.play({ uri: this.track?.uri }));
                console.log('Playing:', this.track?.name);
            }
            else {
                // Toggle play/pause
                this.store.dispatch(PlayerActions.togglePlay());
                console.log(this.playerState?.paused ? 'Paused' : 'Playing');
            }

        } catch (error) {
            console.error('Failed to play track:', error);
            // Fallback: otvori u Spotify app-u
            window.open(this.track?.external_urls?.spotify, '_blank');
        }
    }

    /**
     * Play the next track and emit an event to request it
     */
    nextTrack(): void {
        if (this.nextTrackUri) {
            this.store.dispatch(PlayerActions.play({ uri: this.nextTrackUri }));
            this.nextTrackRequested.emit();
            return;
        }

        this.store.dispatch(PlayerActions.nextTrack());
    }

    /**
     * Play the previous track and emit an event to request it
     */
    previousTrack(): void {
        if (this.previousTrackUri) {
            this.store.dispatch(PlayerActions.play({ uri: this.previousTrackUri }));
            this.previousTrackRequested.emit();
            return;
        }

        this.store.dispatch(PlayerActions.previousTrack());
    }

    /**
     * Handle seek from slider
     */
    onSeek(event: Event): void {
        const input = event.target as HTMLInputElement;
        const position = parseInt(input.value, 10);
        this.store.dispatch(PlayerActions.seek({ position }));
    }

    /**
     * Handle volume change from slider
     */
    onVolumeChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        const volume = parseInt(input.value, 10);
        this.store.dispatch(PlayerActions.setVolume({ volume }));
    }

    /**
     * Format time in milliseconds to mm:ss
     */
    formatTime(ms: number): string {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    /**
     * Update the liked status observable for the current track
     */
    private updateLikedStatusObservable(): void {
        if (!this.track?.id) return;

        this.isLiked$ = this.store.select(LikedTracksSelectors.selectIsTrackLiked(this.track.id));

        this.isLiked$
            .pipe(takeUntil(this.destroy$))
            .subscribe((liked) => {
                this.isLiked = liked;
            });
    }

    /**
     * Toggle like status for the current track
     */
    toggleLike(): void {
        if (!this.track) return;

        if (this.isLiked) {
            this.store.dispatch(LikedTracksActions.unlikeTrack({ trackId: this.track.id }));
        } else {
            const trackData = {
                trackId: this.track.id,
                trackName: this.track.name,
                artistName: this.track.artists?.[0]?.name,
                albumName: this.track.album?.name,
                imageUrl: this.track.album?.images?.[0]?.url
            };

            this.store.dispatch(LikedTracksActions.likeTrack({ trackData }));
        }
    }

    /**
     * Open add to playlist modal
     */
    openAddToPlaylist(): void {
        this.showAddToPlaylist.set(true);
    }

    /**
     * Close add to playlist modal
     */
    closeAddToPlaylist(): void {
        this.showAddToPlaylist.set(false);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
