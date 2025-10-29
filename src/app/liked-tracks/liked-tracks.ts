import { Component, OnInit, OnDestroy, signal, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Track } from '../core/types/track';
import { TrackModal } from '../components/track-modal/track-modal';
import * as SpotifyActions from '../store/spotify/spotify.actions';
import * as SpotifySelectors from '../store/spotify/spotify.selectors';
import * as PlayerActions from '../store/player/player.actions';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-liked-tracks',
    imports: [CommonModule, TrackModal, RouterLink],
  templateUrl: './liked-tracks.html',
  styleUrl: './liked-tracks.css'
})
export class LikedTracks implements OnInit, OnDestroy, AfterViewChecked {
    private destroy$ = new Subject<void>();
    private apiUrl = 'http://localhost:3000';
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
        private readonly http: HttpClient,
        private readonly cdr: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.loadLikedTracks();

        this.store.select(SpotifySelectors.selectTracks)
            .pipe(takeUntil(this.destroy$))
            .subscribe(tracks => {
                this.tracks.set(tracks);
                this.isLoading.set(false);
            });

        this.store.select(SpotifySelectors.selectTracksLoading)
            .pipe(takeUntil(this.destroy$))
            .subscribe(loading => {
                this.isLoading.set(loading);
            });
    }

    loadLikedTracks() {
        this.isLoading.set(true);
        this.http.get<any[]>(`${this.apiUrl}/liked-tracks`)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (likedTracks) => {
                    const trackIds = likedTracks.map(track => track.trackId);
                    if (trackIds.length > 0) {
                        this.store.dispatch(SpotifyActions.loadTracks({ trackIds }));
                    } else {
                        this.isLoading.set(false);
                    }
                },
                error: (error) => {
                    console.error('Failed to fetch liked tracks', error);
                    this.isLoading.set(false);
                }
            });
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
        this.store.dispatch(PlayerActions.pause());
        this.isTrackModalOpen.set(false);
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
