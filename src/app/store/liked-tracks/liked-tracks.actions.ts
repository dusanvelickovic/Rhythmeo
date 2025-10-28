import { createAction, props } from '@ngrx/store';
import { LikedTrack, LikeTrackDto } from '../../core/services/liked-tracks.service';

export const loadLikedTracks = createAction('[Liked Tracks] Load Liked Tracks');

export const loadLikedTracksSuccess = createAction(
    '[Liked Tracks] Load Liked Tracks Success',
    props<{ likedTracks: LikedTrack[] }>()
);

export const loadLikedTracksFailure = createAction(
    '[Liked Tracks] Load Liked Tracks Failure',
    props<{ error: any }>()
);

export const likeTrack = createAction(
    '[Liked Tracks] Like Track',
    props<{ trackData: LikeTrackDto }>()
);

export const likeTrackSuccess = createAction(
    '[Liked Tracks] Like Track Success',
    props<{ likedTrack: LikedTrack }>()
);

export const likeTrackFailure = createAction(
    '[Liked Tracks] Like Track Failure',
    props<{ error: any }>()
);

export const unlikeTrack = createAction(
    '[Liked Tracks] Unlike Track',
    props<{ trackId: string }>()
);

export const unlikeTrackSuccess = createAction(
    '[Liked Tracks] Unlike Track Success',
    props<{ trackId: string }>()
);

export const unlikeTrackFailure = createAction(
    '[Liked Tracks] Unlike Track Failure',
    props<{ error: any }>()
);

export const checkIfLiked = createAction(
    '[Liked Tracks] Check If Liked',
    props<{ trackId: string }>()
);

export const checkIfLikedSuccess = createAction(
    '[Liked Tracks] Check If Liked Success',
    props<{ trackId: string; isLiked: boolean }>()
);

export const checkIfLikedFailure = createAction(
    '[Liked Tracks] Check If Liked Failure',
    props<{ error: any }>()
);
