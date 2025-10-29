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
    })),
    on(SpotifyActions.loadTracks, (state) => ({
        ...state,
        tracksLoading: true,
        tracksError: null,
    })),
    on(SpotifyActions.loadTracksSuccess, (state, { tracks }) => ({
        ...state,
        tracks: tracks,
        tracksLoading: false,
        tracksError: null,
    })),
    on(SpotifyActions.loadTracksFailure, (state, { error }) => ({
        ...state,
        tracksLoading: false,
        tracksError: error,
    })),
    on(SpotifyActions.clearTracks, (state) => ({
        ...state,
        tracks: [],
    }))
);
