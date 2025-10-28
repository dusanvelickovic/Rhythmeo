import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LikedTracksState } from './liked-tracks.state';

export const selectLikedTracksState = createFeatureSelector<LikedTracksState>('likedTracks');

export const selectAllLikedTracks = createSelector(
    selectLikedTracksState,
    (state) => state.likedTracks
);

export const selectLikedTrackIds = createSelector(
    selectLikedTracksState,
    (state) => state.likedTrackIds
);

export const selectIsTrackLiked = (trackId: string) => createSelector(
    selectLikedTrackIds,
    (likedTrackIds) => likedTrackIds.has(trackId)
);

export const selectLikedTracksLoading = createSelector(
    selectLikedTracksState,
    (state) => state.loading
);

export const selectLikedTracksError = createSelector(
    selectLikedTracksState,
    (state) => state.error
);

export const selectLikedTracksCount = createSelector(
    selectAllLikedTracks,
    (likedTracks) => likedTracks.length
);
