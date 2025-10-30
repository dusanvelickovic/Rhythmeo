import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { loadPlaylists, deletePlaylist } from '../store/playlist/playlist.actions';
import { selectAllPlaylists, selectPlaylistsLoading } from '../store/playlist/playlist.selectors';
import { Playlist } from '../store/playlist/playlist.state';

interface PlaylistWithImage extends Playlist {
    firstTrackImageUrl?: string;
}

@Component({
    selector: 'app-playlists',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './playlists.html',
    styleUrl: './playlists.css'
})
export class Playlists implements OnInit, OnDestroy {
    private store = inject(Store);
    private destroy$ = new Subject<void>();

    playlists = signal<Playlist[]>([]);
    isLoading = signal(false);

    ngOnInit(): void {
        // Load playlists on component init
        this.store.dispatch(loadPlaylists());

        // Merge multiple store selectors into a single subscription
        merge(
            this.store.select(selectAllPlaylists).pipe(
                map(playlists => ({ type: 'playlists' as const, data: playlists }))
            ),
            this.store.select(selectPlaylistsLoading).pipe(
                map(loading => ({ type: 'loading' as const, data: loading }))
            )
        ).pipe(
            takeUntil(this.destroy$)
        ).subscribe(result => {
            if (result.type === 'playlists') {
                this.playlists.set(result.data);
            } else if (result.type === 'loading') {
                this.isLoading.set(result.data);
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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
