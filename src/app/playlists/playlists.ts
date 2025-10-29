import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { loadPlaylists, deletePlaylist } from '../store/playlist/playlist.actions';
import { selectAllPlaylists, selectPlaylistsLoading } from '../store/playlist/playlist.selectors';
import { Playlist } from '../store/playlist/playlist.state';

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

        // Subscribe to playlists from store
        this.store.select(selectAllPlaylists)
            .pipe(takeUntil(this.destroy$))
            .subscribe(playlists => {
                this.playlists.set(playlists);
            });

        // Subscribe to loading state
        this.store.select(selectPlaylistsLoading)
            .pipe(takeUntil(this.destroy$))
            .subscribe(loading => {
                this.isLoading.set(loading);
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
