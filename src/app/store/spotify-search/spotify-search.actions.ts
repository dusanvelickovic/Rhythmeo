import { createAction, props } from '@ngrx/store';
import { Track } from '../../core/types/track';

export const searchSpotify = createAction(
    '[Spotify Search] Search Spotify',
    props<{ query: string; searchType?: string }>()
);

export const searchSpotifySuccess = createAction(
    '[Spotify Search] Search Spotify Success',
    props<{ tracks: Track[] }>()
);

export const searchSpotifyFailure = createAction(
    '[Spotify Search] Search Spotify Failure',
    props<{ error: any }>()
);

export const clearSearchResults = createAction(
    '[Spotify Search] Clear Search Results'
);
