// file: `src/app/home/home.ts`
import { CommonModule } from '@angular/common';
import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { SpotifyService } from '../core/services/spotify.service';
import { Track } from '../core/types/track';
import { TrackModal } from '../components/track-modal/track-modal';
import { SpotifyPlayerService } from '../core/services/spotify-player.service';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, TrackModal],
    templateUrl: './home.html',
    styleUrls: ['./home.css'],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Home implements OnInit {
    tracks = signal<Track[]>([]);
    isTrackModalOpen = signal(false);

    // Tracks
    selectedTrack = signal<Track | null>(null);
    nextTrack = signal<Track | null>(null);
    previousTrack = signal<Track | null>(null);
    currentTrackIndex = 0;

    constructor(
        private readonly spotifyService: SpotifyService,
        private readonly spotifyPlayerService: SpotifyPlayerService,
    ) {}

    ngOnInit() {
        this.getUsersTopTracks();
    }

    /**
     * Fetch the user's top tracks from Spotify and update the signal
     */
    getUsersTopTracks() {
        this.spotifyService.getUsersTopTracks().subscribe({
            next: (response: any) => {
                const source =
                    Array.isArray(response) ? response :
                    Array.isArray(response?.items) ? response.items :
                    Array.isArray(response?.tracks?.items) ? response.tracks.items :
                    [];

                if (source.length === 0) {
                    console.warn('Unexpected top-tracks response shape', response);
                }

                this.tracks.set(
                    source.map((item: any) => ({ ...item }))
                );
            },
            error: (err: any) => console.error('Failed to fetch top tracks', err),
        });
    }

    openTrackModal(track: Track) {
        this.selectedTrack.set(track);

        // Find next track
        this.currentTrackIndex = this.tracks().findIndex(t => t.id === track.id);
        this.updateNextAndPreviousTracks();

        this.isTrackModalOpen.set(true);
    }

    /**
     * Handle request to move to the next track
     */
    onNextTrackRequested() {
        // Move to next track
        this.currentTrackIndex++;

        // Check if we have more tracks
        if (this.currentTrackIndex < this.tracks().length) {
            this.selectedTrack.set(this.tracks()[this.currentTrackIndex]);
            this.updateNextAndPreviousTracks();
        } else {
            // No more tracks
            this.nextTrack.set(null);
        }
    }

    /**
     * Handle request to move to the previous track
     */
    onPreviousTrackRequested() {
        // Move to previous track
        this.currentTrackIndex--;

        // Check if we have previous tracks
        if (this.currentTrackIndex >= 0) {
            this.selectedTrack.set(this.tracks()[this.currentTrackIndex]);
            this.updateNextAndPreviousTracks();
        } else {
            // No more previous tracks
            this.previousTrack.set(null);
        }
    }

    /**
     * Update the next and previous tracks based on the current track index
     */
    private updateNextAndPreviousTracks() {
        // Update next track
        if (this.currentTrackIndex !== -1 && this.currentTrackIndex + 1 < this.tracks().length) {
            this.nextTrack.set(this.tracks()[this.currentTrackIndex + 1]);
        } else {
            this.nextTrack.set(null);
        }

        // Update previous track
        if (this.currentTrackIndex !== -1 && this.currentTrackIndex - 1 >= 0) {
            this.previousTrack.set(this.tracks()[this.currentTrackIndex - 1]);
        } else {
            this.previousTrack.set(null);
        }
    }

    closeTrackModal() {
        this.spotifyPlayerService.pause();

        this.isTrackModalOpen.set(false);
    }
}
