// file: `src/app/home/home.ts`
import { CommonModule } from '@angular/common';
import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { SpotifyService } from '../core/services/spotify.service';
import {Track} from '../core/types/track';
import {TrackModal} from '../components/track-modal/track-modal';

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
    selectedTrack = signal<Track | null>(null);

    constructor(private spotifyService: SpotifyService) {}

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
        this.isTrackModalOpen.set(true);
    }

    closeTrackModal() {
        this.isTrackModalOpen.set(false);
    }
}
