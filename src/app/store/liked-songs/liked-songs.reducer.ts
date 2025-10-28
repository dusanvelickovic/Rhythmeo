import { createReducer, on } from '@ngrx/store';
import { LikedSongsState, initialLikedSongsState } from './liked-songs.state';
import * as LikedSongsActions from './liked-songs.actions';

export const likedSongsReducer = createReducer(
    initialLikedSongsState,
    on(LikedSongsActions.loadLikedSongs, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),
    on(LikedSongsActions.loadLikedSongsSuccess, (state, { likedSongs }) => ({
        ...state,
        likedSongs,
        likedTrackIds: new Set(likedSongs.map(song => song.trackId)),
        loading: false,
        error: null,
    })),
    on(LikedSongsActions.loadLikedSongsFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),
    on(LikedSongsActions.likeSong, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),
    on(LikedSongsActions.likeSongSuccess, (state, { likedSong }) => {
        const newLikedTrackIds = new Set(state.likedTrackIds);
        newLikedTrackIds.add(likedSong.trackId);
        return {
            ...state,
            likedSongs: [...state.likedSongs, likedSong],
            likedTrackIds: newLikedTrackIds,
            loading: false,
            error: null,
        };
    }),
    on(LikedSongsActions.likeSongFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),
    on(LikedSongsActions.unlikeSong, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),
    on(LikedSongsActions.unlikeSongSuccess, (state, { trackId }) => {
        const newLikedTrackIds = new Set(state.likedTrackIds);
        newLikedTrackIds.delete(trackId);
        return {
            ...state,
            likedSongs: state.likedSongs.filter(song => song.trackId !== trackId),
            likedTrackIds: newLikedTrackIds,
            loading: false,
            error: null,
        };
    }),
    on(LikedSongsActions.unlikeSongFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    }))
);
