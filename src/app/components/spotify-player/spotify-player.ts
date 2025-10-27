import {Component, Input, OnDestroy, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, signal} from '@angular/core';
import {PlayerState, SpotifyPlayerService} from '../../core/services/spotify-player.service';
import {interval, Subject, takeUntil} from 'rxjs';
import {Track} from '../../core/types/track';
import {LikedSongsService} from '../../core/services/liked-songs.service';

@Component({
  selector: 'app-spotify-player',
  imports: [],
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
    public isLiked = signal(false);

    playerState: PlayerState | null = null;
    isReady = false;
    volume = 20;

    constructor(
        private spotifyPlayerService: SpotifyPlayerService,
        private likedSongsService: LikedSongsService
    ) {}

    /**
     * Toggle volume slider visibility
     */
    toggleVolumeSlider(): void {
        this.showVolumeSlider.set(!this.showVolumeSlider());
    }

    ngOnChanges(changes: SimpleChanges): void {
        // Check liked status when track changes
        if (changes['track'] && changes['track'].currentValue) {
            this.checkLikedStatus();
        }
    }

    async ngOnInit(): Promise<void> {
        // Subscribe to player state
        this.spotifyPlayerService.playerState$
            .pipe(takeUntil(this.destroy$))
            .subscribe((state) => {
                this.playerState = state;
            });

        // Subscribe to ready state
        this.spotifyPlayerService.ready$
            .pipe(takeUntil(this.destroy$))
            .subscribe((ready) => {
                this.isReady = ready;
            });

        // Set playerState track
        if (this.playerState && this.track) {
            this.playerState.current_track = this.track;
        }

        // Check if current track is liked
        if (this.track?.id) {
            this.checkLikedStatus();
        }

        // Update position every second
        interval(1000)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                if (this.playerState && !this.playerState.paused) {
                    this.playerState.position = Math.min(
                        this.playerState.position + 1000,
                        this.playerState.duration
                    );
                }
            });
    }

    private songWasPlayed = false;
    async togglePlay(): Promise<void> {
        try {
            // If the song was never played, play it from the beginning
            // TODO: ugly fix
            if (!this.songWasPlayed) {
                // Mark as played
                this.songWasPlayed = true;

                // Play the track
                await this.spotifyPlayerService.play(this.track?.uri);
                console.log('Playing:', this.track?.name);
            }
            else {
                // Toggle play/pause
                await this.spotifyPlayerService.togglePlay();
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
    async nextTrack(): Promise<void> {
        if (this.nextTrackUri) {
            await this.spotifyPlayerService.play(this.nextTrackUri);
            this.nextTrackRequested.emit();
            return;
        }

        await this.spotifyPlayerService.nextTrack();
    }

    /**
     * Play the previous track and emit an event to request it
     */
    async previousTrack(): Promise<void> {
        if (this.previousTrackUri) {
            await this.spotifyPlayerService.play(this.previousTrackUri);
            this.previousTrackRequested.emit();
            return;
        }

        await this.spotifyPlayerService.previousTrack();
    }

    /**
     * Handle seek from slider
     */
    async onSeek(event: Event): Promise<void> {
        const input = event.target as HTMLInputElement;
        const position = parseInt(input.value, 10);
        await this.spotifyPlayerService.seek(position);
    }

    /**
     * Handle volume change from slider
     */
    async onVolumeChange(event: Event): Promise<void> {
        const input = event.target as HTMLInputElement;
        this.volume = parseInt(input.value, 10);
        await this.spotifyPlayerService.setVolume(this.volume / 100);
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
     * Check if the current track is liked
     */
    checkLikedStatus(): void {
        if (!this.track?.id) return;

        this.likedSongsService.checkIfLiked(this.track.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response) => {
                    this.isLiked.set(response.isLiked);
                },
                error: (error) => {
                    console.error('Failed to check liked status:', error);
                }
            });
    }

    /**
     * Toggle like status for the current track
     */
    toggleLike(): void {
        if (!this.track) return;

        if (this.isLiked()) {
            this.likedSongsService.unlikeSong(this.track.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: () => {
                        this.isLiked.set(false);
                        console.log('Track unliked');
                    },
                    error: (error) => {
                        console.error('Failed to unlike track:', error);
                    }
                });
        } else {
            const songData = {
                trackId: this.track.id,
                trackName: this.track.name,
                artistName: this.track.artists?.[0]?.name,
                albumName: this.track.album?.name,
                imageUrl: this.track.album?.images?.[0]?.url
            };

            this.likedSongsService.likeSong(songData)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: () => {
                        this.isLiked.set(true);
                        console.log('Track liked');
                    },
                    error: (error) => {
                        console.error('Failed to like track:', error);
                    }
                });
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.spotifyPlayerService.cleanUpPlayerState();
    }
}
