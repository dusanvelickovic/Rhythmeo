import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Track } from '../core/types/track';
import { TrackModal } from '../components/track-modal/track-modal';
import * as SpotifyActions from '../store/spotify/spotify.actions';
import * as SpotifySelectors from '../store/spotify/spotify.selectors';
import * as PlayerActions from '../store/player/player.actions';

@Component({
  selector: 'app-liked-songs',
  imports: [CommonModule, TrackModal],
  templateUrl: './liked-songs.html',
  styleUrl: './liked-songs.css'
})
export class LikedSongs implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    private apiUrl = 'http://localhost:3000';

    tracks = signal<Track[]>([]);
    isLoading = signal(false);
    isTrackModalOpen = signal(false);
    selectedTrack = signal<Track | null>(null);
    nextTrack = signal<Track | null>(null);
    previousTrack = signal<Track | null>(null);
    currentTrackIndex = 0;

    constructor(
        private readonly store: Store,
        private readonly http: HttpClient
    ) {}

    ngOnInit() {
        this.loadLikedSongs();

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

    loadLikedSongs() {
        this.isLoading.set(true);
        this.http.get<any[]>(`${this.apiUrl}/liked-songs`)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (likedSongs) => {
                    const trackIds = likedSongs.map(song => song.trackId);
                    if (trackIds.length > 0) {
                        this.store.dispatch(SpotifyActions.loadTracks({ trackIds }));
                    } else {
                        this.isLoading.set(false);
                    }
                },
                error: (error) => {
                    console.error('Failed to fetch liked songs', error);
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

    checkTextOverflow(element: HTMLElement): boolean {
        return element.scrollWidth > element.clientWidth;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
