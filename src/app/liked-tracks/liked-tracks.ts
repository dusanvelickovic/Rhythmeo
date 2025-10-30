import { Component, OnInit, OnDestroy, signal, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subject, takeUntil, filter, distinctUntilChanged, map } from 'rxjs';
import { Track } from '../core/types/track';
import { TrackModal } from '../components/track-modal/track-modal';
import { MiniPlayer } from '../components/mini-player/mini-player';
import * as SpotifyActions from '../store/spotify/spotify.actions';
import * as SpotifySelectors from '../store/spotify/spotify.selectors';
import * as LikedTracksActions from '../store/liked-tracks';
import * as LikedTracksSelectors from '../store/liked-tracks';
import {RouterLink} from '@angular/router';
import * as PlayerSelectors from '../store/player/player.selectors';

@Component({
  selector: 'app-liked-tracks',
    imports: [CommonModule, TrackModal, MiniPlayer, RouterLink],
  templateUrl: './liked-tracks.html',
  styleUrl: './liked-tracks.css'
})
export class LikedTracks implements OnInit, OnDestroy, AfterViewChecked {
    private destroy$ = new Subject<void>();
    private overflowChecked = false;

    tracks = signal<Track[]>([]);
    isLoading = signal(false);
    isTrackModalOpen = signal(false);
    selectedTrack = signal<Track | null>(null);
    nextTrack = signal<Track | null>(null);
    previousTrack = signal<Track | null>(null);
    currentTrackIndex = 0;
    trackOverflows = new Map<string, boolean>();

    constructor(
        private readonly store: Store,
        private readonly cdr: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.loadLikedTracks();

        this.store.select(LikedTracksSelectors.selectAllLikedTracks)
            .pipe(
                takeUntil(this.destroy$),
                map(likedTracks => likedTracks.map(track => track.trackId)),
                distinctUntilChanged((prev, curr) =>
                    prev.length === curr.length && prev.every((id, i) => id === curr[i])
                ),
                filter(trackIds => trackIds.length > 0)
            )
            .subscribe(trackIds => {
                this.store.dispatch(SpotifyActions.loadTracks({ trackIds }));
            });

        this.store.select(SpotifySelectors.selectTracks)
            .pipe(takeUntil(this.destroy$))
            .subscribe(tracks => {
                this.tracks.set(tracks);
            });

        this.store.select(LikedTracksSelectors.selectLikedTracksLoading)
            .pipe(takeUntil(this.destroy$))
            .subscribe(loading => {
                this.isLoading.set(loading);
            });
    }

    loadLikedTracks() {
        this.store.dispatch(LikedTracksActions.loadLikedTracks());
    }

    openTrackModal(track: Track) {
        this.selectedTrack.set(track);
        this.currentTrackIndex = this.tracks().findIndex(t => t.id === track.id);
        this.updateNextAndPreviousTracks(this.currentTrackIndex);
        this.isTrackModalOpen.set(true);
    }

    onNextTrackRequested() {
        const tracksLength = this.tracks().length;
        this.currentTrackIndex = (this.currentTrackIndex + 1) % tracksLength;
        this.selectedTrack.set(this.tracks()[this.currentTrackIndex]);
        this.updateNextAndPreviousTracks(this.currentTrackIndex);
    }

    onPreviousTrackRequested() {
        const tracksLength = this.tracks().length;
        this.currentTrackIndex = (this.currentTrackIndex - 1 + tracksLength) % tracksLength;
        this.selectedTrack.set(this.tracks()[this.currentTrackIndex]);
        this.updateNextAndPreviousTracks(this.currentTrackIndex);
    }

    private updateNextAndPreviousTracks(index: number) {
        const tracksLength = this.tracks().length;
        const nextIndex = (index + 1) % tracksLength;
        const prevIndex = (index - 1 + tracksLength) % tracksLength;
        this.nextTrack.set(this.tracks()[nextIndex]);
        this.previousTrack.set(this.tracks()[prevIndex]);
    }

    closeTrackModal() {
        this.isTrackModalOpen.set(false);
    }

    /**
     * Handle click on mini player to open track modal
     */
    onMiniPlayerClicked() {
        this.store.select(PlayerSelectors.selectPlayerState)
            .pipe(takeUntil(this.destroy$))
            .subscribe(playerState => {
                if (playerState?.current_track) {
                    this.selectedTrack.set(playerState.current_track);
                    const index = this.tracks().findIndex(t => t.id === playerState.current_track?.id);
                    if (index !== -1) {
                        this.currentTrackIndex = index;
                        this.updateNextAndPreviousTracks(index);
                    }
                    this.isTrackModalOpen.set(true);
                }
            }).unsubscribe();
    }

    ngAfterViewChecked(): void {
        if (!this.overflowChecked && this.tracks().length > 0) {
            this.overflowChecked = true;
            setTimeout(() => {
                const elements = document.querySelectorAll('[data-track-name]');
                elements.forEach((el: Element) => {
                    const htmlEl = el as HTMLElement;
                    const trackId = htmlEl.getAttribute('data-track-id');
                    if (trackId) {
                        this.trackOverflows.set(trackId, htmlEl.scrollWidth > htmlEl.clientWidth);
                    }
                });
                this.cdr.detectChanges();
            });
        }
    }

    checkTextOverflow(trackId: string): boolean {
        return this.trackOverflows.get(trackId) || false;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
