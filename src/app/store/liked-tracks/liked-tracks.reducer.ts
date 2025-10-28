import { createReducer, on } from '@ngrx/store';
import { LikedTracksState, initialLikedTracksState } from './liked-tracks.state';
import * as LikedTracksActions from './liked-tracks.actions';

export const likedTracksReducer = createReducer(
    initialLikedTracksState,
    on(LikedTracksActions.loadLikedTracks, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),
    on(LikedTracksActions.loadLikedTracksSuccess, (state, { likedTracks }) => ({
        ...state,
        likedTracks,
        likedTrackIds: new Set(likedTracks.map(track => track.trackId)),
        loading: false,
        error: null,
    })),
    on(LikedTracksActions.loadLikedTracksFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),
    on(LikedTracksActions.likeTrack, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),
    on(LikedTracksActions.likeTrackSuccess, (state, { likedTrack }) => {
        const newLikedTrackIds = new Set(state.likedTrackIds);
        newLikedTrackIds.add(likedTrack.trackId);
        return {
            ...state,
            likedTracks: [...state.likedTracks, likedTrack],
            likedTrackIds: newLikedTrackIds,
            loading: false,
            error: null,
        };
    }),
    on(LikedTracksActions.likeTrackFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),
    on(LikedTracksActions.unlikeTrack, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),
    on(LikedTracksActions.unlikeTrackSuccess, (state, { trackId }) => {
        const newLikedTrackIds = new Set(state.likedTrackIds);
        newLikedTrackIds.delete(trackId);
        return {
            ...state,
            likedTracks: state.likedTracks.filter(track => track.trackId !== trackId),
            likedTrackIds: newLikedTrackIds,
            loading: false,
            error: null,
        };
    }),
    on(LikedTracksActions.unlikeTrackFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    }))
);
