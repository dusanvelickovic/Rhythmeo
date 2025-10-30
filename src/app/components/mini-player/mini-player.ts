import {Component, OnDestroy, OnInit, Output, EventEmitter, Input} from '@angular/core';
import { Store } from '@ngrx/store';
import {interval, Observable, Subject, takeUntil} from 'rxjs';
import { PlayerState } from '../../store/player/player.state';
import * as PlayerSelectors from '../../store/player/player.selectors';
import * as PlayerActions from '../../store/player/player.actions';

@Component({
  selector: 'app-mini-player',
  templateUrl: './mini-player.html',
  styleUrl: './mini-player.css'
})
export class MiniPlayer implements OnInit, OnDestroy {
    @Input() isModalOpen: boolean = false;
    @Output() trackClicked = new EventEmitter<void>();

    playerState: PlayerState | null = null;
    private destroy$ = new Subject<void>();

    playerState$!: Observable<PlayerState>;

    constructor(private store: Store) {
        this.playerState$ = this.store.select(PlayerSelectors.selectPlayerState);
    }

    ngOnInit(): void {
        this.store.select(PlayerSelectors.selectPlayerState)
            .pipe(takeUntil(this.destroy$))
            .subscribe(state => {
                this.playerState = state;
            });

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

    shouldShow(): boolean {
        return !!(this.playerState?.current_track && !this.isModalOpen);
    }

    openTrackModal(): void {
        this.trackClicked.emit();
    }

    togglePlay(): void {
        this.store.dispatch(PlayerActions.togglePlay());
    }

    onVolumeChange(event: Event): void {
        const volume = Number((event.target as HTMLInputElement).value);
        this.store.dispatch(PlayerActions.setVolume({ volume }));
    }

    onSeek(event: Event): void {
        const position = Number((event.target as HTMLInputElement).value);
        this.store.dispatch(PlayerActions.seek({ position }));
    }

    formatTime(ms: number): string {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
