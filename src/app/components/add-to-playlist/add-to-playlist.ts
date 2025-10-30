import { Component, Input, Output, EventEmitter, signal, OnInit, inject, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { loadPlaylists, createPlaylist, addTrackToPlaylist } from '../../store/playlist/playlist.actions';
import { selectAllPlaylists, selectPlaylistsLoading } from '../../store/playlist/playlist.selectors';
import { Actions, ofType } from '@ngrx/effects';
import * as PlaylistActions from '../../store/playlist/playlist.actions';
import { Subject, takeUntil, merge } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Playlist {
    id: number;
    name: string;
    imageUrl?: string;
    trackCount?: number;
}

@Component({
    selector: 'app-add-to-playlist',
    imports: [CommonModule],
    templateUrl: './add-to-playlist.html',
    styleUrl: './add-to-playlist.css'
})
export class AddToPlaylist implements OnInit, OnChanges, OnDestroy {
    private store = inject(Store);
    private actions$ = inject(Actions);
    private destroy$ = new Subject<void>();
    private pendingPlaylistId: number | null = null;

    @Input() isOpen = false;
    @Input() trackId: string | null = null;
    @Input() trackName: string | null = null;
    @Output() close = new EventEmitter<void>();
    @Output() addToPlaylist = new EventEmitter<number>();

    playlists = signal<Playlist[]>([]);
    isLoading = signal(false);
    searchQuery = signal('');
    showCreateForm = signal(false);
    newPlaylistName = signal('');

    ngOnInit(): void {
        // Merge store selectors and actions into a single subscription
        merge(
            this.store.select(selectAllPlaylists).pipe(
                map(playlists => ({ type: 'playlists' as const, data: playlists }))
            ),
            this.store.select(selectPlaylistsLoading).pipe(
                map(loading => ({ type: 'loading' as const, data: loading }))
            ),
            this.actions$.pipe(
                ofType(PlaylistActions.addTrackToPlaylistSuccess),
                map(action => ({ type: 'addTrackSuccess' as const, data: action }))
            ),
            this.actions$.pipe(
                ofType(PlaylistActions.createPlaylistSuccess),
                map(action => ({ type: 'createPlaylistSuccess' as const, data: action }))
            )
        ).pipe(
            takeUntil(this.destroy$)
        ).subscribe(result => {
            if (result.type === 'playlists') {
                this.playlists.set([...result.data] as Playlist[]);
            } else if (result.type === 'loading') {
                this.isLoading.set(result.data);
            } else if (result.type === 'addTrackSuccess') {
                const action = result.data;
                if (this.pendingPlaylistId === action.playlistId && this.trackId === action.trackId) {
                    this.addToPlaylist.emit(action.playlistId);
                    this.pendingPlaylistId = null;
                    this.onClose();
                }
            } else if (result.type === 'createPlaylistSuccess') {
                this.showCreateForm.set(false);
                this.newPlaylistName.set('');
                if (this.trackId) {
                    this.onAddToPlaylist(result.data.playlist.id);
                }
            }
        });
    }

    /**
     * Detect changes to isOpen input
     */
    ngOnChanges(changes: SimpleChanges): void {
        // Load playlists when modal is opened
        if (changes['isOpen'] && changes['isOpen'].currentValue === true) {
            this.loadPlaylists();
            this.searchQuery.set('');
            this.showCreateForm.set(false);
            this.newPlaylistName.set('');
        }
    }

    loadPlaylists(): void {
        this.store.dispatch(loadPlaylists());
    }

    onClose(): void {
        this.close.emit();
    }

    onAddToPlaylist(playlistId: number): void {
        if (!this.trackId) return;

        this.pendingPlaylistId = playlistId;
        this.store.dispatch(addTrackToPlaylist({ playlistId, trackId: this.trackId }));
    }

    /**
     * Get filtered playlists based on search query
     */
    get filteredPlaylists(): Playlist[] {
        const query = this.searchQuery().toLowerCase();
        if (!query) {
            return this.playlists();
        }
        return this.playlists().filter(p =>
            p.name.toLowerCase().includes(query)
        );
    }

    onSearchInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.searchQuery.set(input.value);
    }

    onShowCreateForm(): void {
        this.showCreateForm.set(true);
    }

    onCancelCreate(): void {
        this.showCreateForm.set(false);
        this.newPlaylistName.set('');
    }

    onCreatePlaylist(): void {
        const name = this.newPlaylistName().trim();
        if (!name) return;

        this.store.dispatch(createPlaylist({ playlistData: { name } }));
    }

    onPlaylistNameInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.newPlaylistName.set(input.value);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
