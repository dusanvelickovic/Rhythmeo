import { Component, signal } from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {SearchParams, SpotifySearch} from '../spotify-search/spotify-search';
import { Store } from '@ngrx/store';
import * as SpotifySearchActions from '../../store/spotify-search/spotify-search.actions';
import * as SpotifyActions from '../../store/spotify/spotify.actions';

@Component({
  selector: 'app-navigation',
    imports: [
        RouterLink,
        RouterLinkActive,
        SpotifySearch
    ],
  templateUrl: './navigation.html',
})
export class Navigation {
    isMobileMenuOpen = signal(false);

    constructor(
        private router: Router,
        private store: Store
    ) {}

    toggleMobileMenu() {
        this.isMobileMenuOpen.set(!this.isMobileMenuOpen());
    }

    closeMobileMenu() {
        this.isMobileMenuOpen.set(false);
    }

    /**
     * Handle search requests from SpotifySearch component
     */
    onSearchRequested(params: SearchParams) {
        if (params.type === 'reset') {
            this.store.dispatch(SpotifySearchActions.clearSearchResults());
            this.store.dispatch(SpotifyActions.loadTopTracks());
        } else {
            const query = params.type === 'genre' ? `genre:${params.value}` : params.value;
            this.store.dispatch(SpotifySearchActions.searchSpotify({ query, searchType: 'track' }));
        }

        if (this.router.url !== '/home') {
            this.router.navigate(['/home']);
        }

        this.closeMobileMenu();
    }
}
