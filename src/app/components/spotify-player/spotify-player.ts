import {Component, Input, OnDestroy, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, signal} from '@angular/core';
import {interval, Subject, takeUntil, Observable} from 'rxjs';
import {Track} from '../../core/types/track';
import {LikedSongsService} from '../../core/services/liked-songs.service';
import { Store } from '@ngrx/store';
import * as PlayerActions from '../../store/player/player.actions';
import * as PlayerSelectors from '../../store/player/player.selectors';
import { PlayerState } from '../../store/player/player.state';

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

    playerState$!: Observable<PlayerState>;
    isReady$!: Observable<boolean>;
    volume$!: Observable<number>;

    playerState: PlayerState | null = null;
    isReady = false;
    volume = 20;

    constructor(
        private likedSongsService: LikedSongsService,
        private store: Store
    ) {
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

    ngOnChanges(changes: SimpleChanges): void {
        // Check liked status when track changes
        if (changes['track'] && changes['track'].currentValue) {
            this.checkLikedStatus();
        }
    }

    async ngOnInit(): Promise<void> {
        // Subscribe to player state from store
        this.playerState$
            .pipe(takeUntil(this.destroy$))
            .subscribe((state) => {
                this.playerState = state;
            });

        // Subscribe to ready state from store
        this.isReady$
            .pipe(takeUntil(this.destroy$))
            .subscribe((ready) => {
                this.isReady = ready;
            });

        // Subscribe to volume from store
        this.volume$
            .pipe(takeUntil(this.destroy$))
            .subscribe((volume) => {
                this.volume = volume;
            });

        // Check if current track is liked
        if (this.track?.id) {
            this.checkLikedStatus();
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
        this.store.dispatch(PlayerActions.cleanupPlayerState());
    }
}
