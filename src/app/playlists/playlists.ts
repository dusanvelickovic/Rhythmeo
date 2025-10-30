import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil, combineLatest } from 'rxjs';
import { loadPlaylists, deletePlaylist } from '../store/playlist/playlist.actions';
import { selectAllPlaylists, selectPlaylistsLoading } from '../store/playlist/playlist.selectors';
import { Playlist } from '../store/playlist/playlist.state';
import { MiniPlayer } from '../components/mini-player/mini-player';
import { TrackModal } from '../components/track-modal/track-modal';
import { Track } from '../core/types/track';
import * as PlayerSelectors from '../store/player/player.selectors';

interface PlaylistWithImage extends Playlist {
    firstTrackImageUrl?: string;
}

@Component({
    selector: 'app-playlists',
    standalone: true,
    imports: [CommonModule, RouterModule, MiniPlayer, TrackModal],
    templateUrl: './playlists.html',
    styleUrl: './playlists.css'
})
export class Playlists implements OnInit, OnDestroy {
    private store = inject(Store);
    private destroy$ = new Subject<void>();

    playlists = signal<Playlist[]>([]);
    isLoading = signal(false);
    isTrackModalOpen = signal(false);
    selectedTrack = signal<Track | null>(null);

    ngOnInit(): void {
        // Load playlists on component init
        this.store.dispatch(loadPlaylists());

        // Combine multiple store selectors into a single subscription
        combineLatest([
            this.store.select(selectAllPlaylists),
            this.store.select(selectPlaylistsLoading),
            this.store.select(PlayerSelectors.selectPlayerState)
        ]).pipe(
            takeUntil(this.destroy$)
        ).subscribe(([playlists, loading, playerState]) => {
            this.playlists.set(playlists);
            this.isLoading.set(loading);
            // Update selected track from player state if not set
            if (playerState?.current_track && !this.selectedTrack()) {
                this.selectedTrack.set(playerState.current_track);
            }
        });
    }

    onDeletePlaylist(playlistId: number, event: Event): void {
        event.stopPropagation();
        event.preventDefault();

        if (confirm('Are you sure you want to delete this playlist?')) {
            this.store.dispatch(deletePlaylist({ playlistId }));
        }
    }

    /**
     * Handle mini player click to open track modal
     */
    onMiniPlayerClicked(): void {
        // Get current track from player state and open modal
        this.store.select(PlayerSelectors.selectPlayerState)
            .pipe(takeUntil(this.destroy$))
            .subscribe(playerState => {
                if (playerState?.current_track) {
                    this.selectedTrack.set(playerState.current_track);
                    this.isTrackModalOpen.set(true);
                }
            }).unsubscribe();
    }

    closeTrackModal(): void {
        this.isTrackModalOpen.set(false);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
