import { createAction, props } from '@ngrx/store';
import { Track } from '../../core/types/track';

export const loadTopTracks = createAction('[Spotify] Load Top Tracks');

export const loadTopTracksSuccess = createAction(
    '[Spotify] Load Top Tracks Success',
    props<{ tracks: Track[] }>()
);

export const loadTopTracksFailure = createAction(
    '[Spotify] Load Top Tracks Failure',
    props<{ error: any }>()
);

export const loadTracks = createAction(
    '[Spotify] Load Tracks',
    props<{ trackIds: string[] }>()
);

export const loadTracksSuccess = createAction(
    '[Spotify] Load Tracks Success',
    props<{ tracks: Track[] }>()
);

export const loadTracksFailure = createAction(
    '[Spotify] Load Tracks Failure',
    props<{ error: any }>()
);

export const clearTracks = createAction('[Spotify] Clear Tracks');
