import { Component, OnDestroy, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { PlayerState } from '../../store/player/player.state';
import * as PlayerSelectors from '../../store/player/player.selectors';

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

    constructor(private store: Store) {}

    ngOnInit(): void {
        this.store.select(PlayerSelectors.selectPlayerState)
            .pipe(takeUntil(this.destroy$))
            .subscribe(state => {
                this.playerState = state;
            });
    }

    shouldShow(): boolean {
        return !!(this.playerState?.current_track && !this.playerState?.paused && !this.isModalOpen);
    }

    openTrackModal(): void {
        this.trackClicked.emit();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
