import { createReducer, on } from '@ngrx/store';
import { initialSpotifyState } from './spotify.state';
import * as SpotifyActions from './spotify.actions';

export const spotifyReducer = createReducer(
    initialSpotifyState,
    on(SpotifyActions.loadTopTracks, (state) => ({
        ...state,
        topTracksLoading: true,
        topTracksError: null,
    })),
    on(SpotifyActions.loadTopTracksSuccess, (state, { tracks }) => ({
        ...state,
        topTracks: tracks,
        topTracksLoading: false,
        topTracksError: null,
    })),
    on(SpotifyActions.loadTopTracksFailure, (state, { error }) => ({
        ...state,
        topTracksLoading: false,
        topTracksError: error,
    }))
);
