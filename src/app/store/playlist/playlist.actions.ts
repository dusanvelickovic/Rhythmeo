import { createAction, props } from '@ngrx/store';
import { Playlist } from './playlist.state';

export interface CreatePlaylistDto {
    name: string;
}

export interface AddTrackToPlaylistDto {
    playlistId: number;
    trackId: string;
}

// Load Playlists
export const loadPlaylists = createAction('[Playlist] Load Playlists');

export const loadPlaylistsSuccess = createAction(
    '[Playlist] Load Playlists Success',
    props<{ playlists: Playlist[] }>()
);

export const loadPlaylistsFailure = createAction(
    '[Playlist] Load Playlists Failure',
    props<{ error: any }>()
);

// Create Playlist
export const createPlaylist = createAction(
    '[Playlist] Create Playlist',
    props<{ playlistData: CreatePlaylistDto }>()
);

export const createPlaylistSuccess = createAction(
    '[Playlist] Create Playlist Success',
    props<{ playlist: Playlist }>()
);

export const createPlaylistFailure = createAction(
    '[Playlist] Create Playlist Failure',
    props<{ error: any }>()
);

// Add Track to Playlist
export const addTrackToPlaylist = createAction(
    '[Playlist] Add Track to Playlist',
    props<{ playlistId: number; trackId: string }>()
);

export const addTrackToPlaylistSuccess = createAction(
    '[Playlist] Add Track to Playlist Success',
    props<{ playlistId: number; trackId: string }>()
);

export const addTrackToPlaylistFailure = createAction(
    '[Playlist] Add Track to Playlist Failure',
    props<{ error: any }>()
);

// Select Playlist
export const selectPlaylist = createAction(
    '[Playlist] Select Playlist',
    props<{ playlistId: number }>()
);

// Delete Playlist
export const deletePlaylist = createAction(
    '[Playlist] Delete Playlist',
    props<{ playlistId: number }>()
);

export const deletePlaylistSuccess = createAction(
    '[Playlist] Delete Playlist Success',
    props<{ playlistId: number }>()
);

export const deletePlaylistFailure = createAction(
    '[Playlist] Delete Playlist Failure',
    props<{ error: any }>()
);

// Update Playlist
export const updatePlaylist = createAction(
    '[Playlist] Update Playlist',
    props<{ playlistId: number; updates: Partial<Playlist> }>()
);

export const updatePlaylistSuccess = createAction(
    '[Playlist] Update Playlist Success',
    props<{ playlist: Playlist }>()
);

export const updatePlaylistFailure = createAction(
    '[Playlist] Update Playlist Failure',
    props<{ error: any }>()
);

// Remove Track from Playlist
export const removeTrackFromPlaylist = createAction(
    '[Playlist] Remove Track from Playlist',
    props<{ playlistId: number; trackId: string }>()
);

export const removeTrackFromPlaylistSuccess = createAction(
    '[Playlist] Remove Track from Playlist Success',
    props<{ playlistId: number; trackId: string }>()
);

export const removeTrackFromPlaylistFailure = createAction(
    '[Playlist] Remove Track from Playlist Failure',
    props<{ error: any }>()
);
