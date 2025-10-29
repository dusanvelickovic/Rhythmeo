import { Component, Input, Output, EventEmitter, signal, OnInit, inject, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { loadPlaylists, createPlaylist, addTrackToPlaylist } from '../../store/playlist/playlist.actions';
import { selectAllPlaylists, selectPlaylistsLoading } from '../../store/playlist/playlist.selectors';
import { Actions, ofType } from '@ngrx/effects';
import * as PlaylistActions from '../../store/playlist/playlist.actions';
import { Subject, takeUntil } from 'rxjs';

export interface Playlist {
    id: number;
    name: string;
    description?: string;
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
        // Subscribe to playlists from store
        this.store.select(selectAllPlaylists)
            .pipe(takeUntil(this.destroy$))
            .subscribe(playlists => {
                this.playlists.set(playlists as Playlist[]);
            });

        this.store.select(selectPlaylistsLoading)
            .pipe(takeUntil(this.destroy$))
            .subscribe(loading => {
                this.isLoading.set(loading);
            });
    }

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
        
        this.store.dispatch(addTrackToPlaylist({ playlistId, trackId: this.trackId }));
        
        // Listen for success action
        this.actions$.pipe(
            ofType(PlaylistActions.addTrackToPlaylistSuccess),
            takeUntil(this.destroy$)
        ).subscribe(() => {
            this.addToPlaylist.emit(playlistId);
            this.onClose();
        });
    }

    get filteredPlaylists(): Playlist[] {
        const query = this.searchQuery().toLowerCase();
        if (!query) {
            return this.playlists();
        }
        return this.playlists().filter(p => 
            p.name.toLowerCase().includes(query) || 
            p.description?.toLowerCase().includes(query)
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
        
        // Listen for success action
        this.actions$.pipe(
            ofType(PlaylistActions.createPlaylistSuccess),
            takeUntil(this.destroy$)
        ).subscribe(({ playlist }) => {
            this.showCreateForm.set(false);
            this.newPlaylistName.set('');
            
            // If trackId is set, add the track to the newly created playlist
            if (this.trackId) {
                this.onAddToPlaylist(playlist.id);
            }
        });
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
