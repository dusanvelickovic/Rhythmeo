import { Component, signal, output, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface SearchParams {
    type: 'genre' | 'custom' | 'reset';
    value: string;
}

@Component({
    selector: 'app-spotify-search',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './spotify-search.html',
    styleUrls: ['./spotify-search.css'],
})
export class SpotifySearch {
    searchRequested = output<SearchParams>();

    genres = ['pop', 'rock', 'hiphop', 'electronic'];
    selectedGenre = signal<string | null>(null);
    customQuery = signal<string>('');
    searchMode = signal<'genre' | 'custom'>('genre');
    isExpanded = signal<boolean>(false);

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        const target = event.target as HTMLElement;
        const clickedInside = target.closest('.spotify-search-container');
        
        if (!clickedInside && this.isExpanded()) {
            this.isExpanded.set(false);
        }
    }

    /**
     * Select a genre and emit search request
     */
    selectGenre(genre: string) {
        this.selectedGenre.set(genre);
        this.searchRequested.emit({ type: 'genre', value: genre });
    }

    /**
     * Switch to genre search mode
     */
    switchToGenreMode() {
        this.searchMode.set('genre');
        this.customQuery.set('');
    }

    /**
     * Switch to custom search mode
     */
    switchToCustomMode() {
        this.searchMode.set('custom');
        this.selectedGenre.set(null);
    }

    /**
     * Handle search mode change
     */
    onModeChange(event: Event) {
        const mode = (event.target as HTMLSelectElement).value as 'genre' | 'custom';
        if (mode === 'genre') {
            this.switchToGenreMode();
        } else {
            this.switchToCustomMode();
        }
    }

    /**
     * Handle genre selection change
     */
    onGenreChange(event: Event) {
        const genre = (event.target as HTMLSelectElement).value;
        if (genre) {
            this.selectGenre(genre);
        }
    }

    /**
     * Handle custom search submission
     */
    onCustomSearch() {
        const query = this.customQuery().trim();
        if (query) {
            this.searchRequested.emit({ type: 'custom', value: query });
        }
    }

    /**
     * Update the custom query based on user input
     */
    updateCustomQuery(event: Event) {
        const target = event.target as HTMLInputElement;
        this.customQuery.set(target.value);
    }

    /**
     * Toggle the search bar expansion state
     */
    toggleSearch() {
        this.isExpanded.set(!this.isExpanded());
    }

    /**
     * Reset search settings and fallback to top tracks
     */
    resetSearch() {
        this.selectedGenre.set(null);
        this.customQuery.set('');
        this.searchMode.set('genre');
        this.isExpanded.set(false);
        this.searchRequested.emit({ type: 'reset', value: '' });
    }
}
