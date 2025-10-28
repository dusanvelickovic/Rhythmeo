import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LikedSongsState } from './liked-songs.state';

export const selectLikedSongsState = createFeatureSelector<LikedSongsState>('likedSongs');

export const selectAllLikedSongs = createSelector(
    selectLikedSongsState,
    (state) => state.likedSongs
);

export const selectLikedTrackIds = createSelector(
    selectLikedSongsState,
    (state) => state.likedTrackIds
);

export const selectIsTrackLiked = (trackId: string) => createSelector(
    selectLikedTrackIds,
    (likedTrackIds) => likedTrackIds.has(trackId)
);

export const selectLikedSongsLoading = createSelector(
    selectLikedSongsState,
    (state) => state.loading
);

export const selectLikedSongsError = createSelector(
    selectLikedSongsState,
    (state) => state.error
);

export const selectLikedSongsCount = createSelector(
    selectAllLikedSongs,
    (likedSongs) => likedSongs.length
);
