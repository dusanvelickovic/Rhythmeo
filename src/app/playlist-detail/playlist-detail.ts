import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Track } from '../core/types/track';
import { TrackModal } from '../components/track-modal/track-modal';
import * as SpotifyActions from '../store/spotify/spotify.actions';
import * as SpotifySelectors from '../store/spotify/spotify.selectors';
import * as PlayerActions from '../store/player/player.actions';
import * as PlaylistActions from '../store/playlist/playlist.actions';
import { selectPlaylistById } from '../store/playlist/playlist.selectors';
import { Playlist } from '../store/playlist/playlist.state';

@Component({
    selector: 'app-playlist-detail',
    standalone: true,
    imports: [CommonModule, TrackModal, RouterLink],
    templateUrl: './playlist-detail.html',
})
export class PlaylistDetail implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    private apiUrl = 'http://localhost:3000';
    private playlistId: number = 0;

    playlist = signal<Playlist | null>(null);
    tracks = signal<Track[]>([]);
    isLoading = signal(false);
    isTrackModalOpen = signal(false);
    selectedTrack = signal<Track | null>(null);
    nextTrack = signal<Track | null>(null);
    previousTrack = signal<Track | null>(null);
    currentTrackIndex = 0;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly store: Store,
        private readonly http: HttpClient
    ) {}

    ngOnInit() {
        // Load playlists to ensure we have the playlist data
        this.store.dispatch(PlaylistActions.loadPlaylists());

        // Get playlist ID from route
        this.route.params
            .pipe(takeUntil(this.destroy$))
            .subscribe(params => {
                this.playlistId = +params['id'];
                this.loadPlaylistDetails();
            });

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

    /**
     * Load playlist details and tracks
     */
    private loadPlaylistDetails() {
        // Load playlist info
        this.store.select(selectPlaylistById(this.playlistId))
            .pipe(takeUntil(this.destroy$))
            .subscribe(playlist => {
                this.playlist.set(playlist || null);
            });

        // Load playlist tracks
        this.isLoading.set(true);
        this.http.get<any[]>(`${this.apiUrl}/playlists/${this.playlistId}/tracks`)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (playlistTracks) => {
                    const trackIds = playlistTracks.map(track => track.trackId);
                    if (trackIds.length > 0) {
                        this.store.dispatch(SpotifyActions.loadTracks({ trackIds }));
                    } else {
                        this.isLoading.set(false);
                    }
                },
                error: (error) => {
                    console.error('Failed to fetch playlist tracks', error);
                    this.isLoading.set(false);
                }
            });
    }

    /**
     * Open track modal for the selected track
     */
    openTrackModal(track: Track) {
        this.selectedTrack.set(track);
        this.currentTrackIndex = this.tracks().findIndex(t => t.id === track.id);
        this.updateNextAndPreviousTracks(this.currentTrackIndex);
        this.isTrackModalOpen.set(true);
    }

    /**
     * Handle next track request
     */
    onNextTrackRequested() {
        const tracksLength = this.tracks().length;
        this.currentTrackIndex = (this.currentTrackIndex + 1) % tracksLength;
        this.selectedTrack.set(this.tracks()[this.currentTrackIndex]);
        this.updateNextAndPreviousTracks(this.currentTrackIndex);
    }

    /**
     * Handle previous track request
     */
    onPreviousTrackRequested() {
        const tracksLength = this.tracks().length;
        this.currentTrackIndex = (this.currentTrackIndex - 1 + tracksLength) % tracksLength;
        this.selectedTrack.set(this.tracks()[this.currentTrackIndex]);
        this.updateNextAndPreviousTracks(this.currentTrackIndex);
    }

    /**
     * Update next and previous tracks based on the current index
     */
    private updateNextAndPreviousTracks(index: number) {
        const tracksLength = this.tracks().length;
        const nextIndex = (index + 1) % tracksLength;
        const prevIndex = (index - 1 + tracksLength) % tracksLength;
        this.nextTrack.set(this.tracks()[nextIndex]);
        this.previousTrack.set(this.tracks()[prevIndex]);
    }

    /**
     * Close the track modal
     */
    closeTrackModal() {
        this.store.dispatch(PlayerActions.pause());
        this.isTrackModalOpen.set(false);
    }

    /**
     * Cleanup on component destroy
     */
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
