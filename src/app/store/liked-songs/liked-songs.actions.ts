import { createAction, props } from '@ngrx/store';
import { LikedSong, LikeSongDto } from '../../core/services/liked-songs.service';

export const loadLikedSongs = createAction('[Liked Songs] Load Liked Songs');

export const loadLikedSongsSuccess = createAction(
    '[Liked Songs] Load Liked Songs Success',
    props<{ likedSongs: LikedSong[] }>()
);

export const loadLikedSongsFailure = createAction(
    '[Liked Songs] Load Liked Songs Failure',
    props<{ error: any }>()
);

export const likeSong = createAction(
    '[Liked Songs] Like Song',
    props<{ songData: LikeSongDto }>()
);

export const likeSongSuccess = createAction(
    '[Liked Songs] Like Song Success',
    props<{ likedSong: LikedSong }>()
);

export const likeSongFailure = createAction(
    '[Liked Songs] Like Song Failure',
    props<{ error: any }>()
);

export const unlikeSong = createAction(
    '[Liked Songs] Unlike Song',
    props<{ trackId: string }>()
);

export const unlikeSongSuccess = createAction(
    '[Liked Songs] Unlike Song Success',
    props<{ trackId: string }>()
);

export const unlikeSongFailure = createAction(
    '[Liked Songs] Unlike Song Failure',
    props<{ error: any }>()
);

export const checkIfLiked = createAction(
    '[Liked Songs] Check If Liked',
    props<{ trackId: string }>()
);

export const checkIfLikedSuccess = createAction(
    '[Liked Songs] Check If Liked Success',
    props<{ trackId: string; isLiked: boolean }>()
);

export const checkIfLikedFailure = createAction(
    '[Liked Songs] Check If Liked Failure',
    props<{ error: any }>()
);
