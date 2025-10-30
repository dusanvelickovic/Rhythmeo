import { createReducer, on } from '@ngrx/store';
import { initialSpotifySearchState } from './spotify-search.state';
import * as SpotifySearchActions from './spotify-search.actions';

export const spotifySearchReducer = createReducer(
    initialSpotifySearchState,
    on(SpotifySearchActions.searchSpotify, (state, { query }) => ({
        ...state,
        searchLoading: true,
        searchError: null,
        searchQuery: query,
    })),
    on(SpotifySearchActions.searchSpotifySuccess, (state, { tracks }) => ({
        ...state,
        searchResults: tracks,
        searchLoading: false,
        searchError: null,
    })),
    on(SpotifySearchActions.searchSpotifyFailure, (state, { error }) => ({
        ...state,
        searchLoading: false,
        searchError: error,
    })),
    on(SpotifySearchActions.clearSearchResults, (state) => ({
        ...state,
        searchResults: [],
        searchQuery: null,
        searchError: null,
    }))
);
