import { Component, Input, Output, EventEmitter, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

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
export class AddToPlaylist implements OnInit {
    @Input() isOpen = false;
    @Input() trackId: string | null = null;
    @Input() trackName: string | null = null;
    @Output() close = new EventEmitter<void>();
    @Output() addToPlaylist = new EventEmitter<number>();

    playlists = signal<Playlist[]>([]);
    isLoading = signal(false);
    searchQuery = signal('');

    ngOnInit(): void {
        if (this.isOpen) {
            this.loadPlaylists();
        }
    }

    loadPlaylists(): void {
        this.isLoading.set(true);
        // TODO: Load playlists from API
        // For now, using mock data
        setTimeout(() => {
            this.playlists.set([
                { id: 1, name: 'My Favorites', description: 'Best tracks', trackCount: 42 },
                { id: 2, name: 'Workout Mix', description: 'High energy songs', trackCount: 28 },
                { id: 3, name: 'Chill Vibes', description: 'Relaxing music', trackCount: 15 },
            ]);
            this.isLoading.set(false);
        }, 500);
    }

    onClose(): void {
        this.close.emit();
    }

    onAddToPlaylist(playlistId: number): void {
        this.addToPlaylist.emit(playlistId);
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
}
