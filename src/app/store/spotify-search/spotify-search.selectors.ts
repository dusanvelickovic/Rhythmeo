import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SpotifySearchState } from './spotify-search.state';

export const selectSpotifySearchState = createFeatureSelector<SpotifySearchState>('spotifySearch');

export const selectSearchResults = createSelector(
    selectSpotifySearchState,
    (state) => state.searchResults
);

export const selectSearchLoading = createSelector(
    selectSpotifySearchState,
    (state) => state.searchLoading
);

export const selectSearchError = createSelector(
    selectSpotifySearchState,
    (state) => state.searchError
);

export const selectSearchQuery = createSelector(
    selectSpotifySearchState,
    (state) => state.searchQuery
);
