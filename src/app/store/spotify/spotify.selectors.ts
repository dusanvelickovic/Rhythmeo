import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SpotifyState } from './spotify.state';

export const selectSpotifyState = createFeatureSelector<SpotifyState>('spotify');

export const selectTopTracks = createSelector(
    selectSpotifyState,
    (state: SpotifyState) => state.topTracks
);

export const selectTopTracksLoading = createSelector(
    selectSpotifyState,
    (state: SpotifyState) => state.topTracksLoading
);

export const selectTopTracksError = createSelector(
    selectSpotifyState,
    (state: SpotifyState) => state.topTracksError
);
