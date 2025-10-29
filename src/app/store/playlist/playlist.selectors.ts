import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PlaylistState } from './playlist.state';

export const selectPlaylistState = createFeatureSelector<PlaylistState>('playlist');

export const selectAllPlaylists = createSelector(
    selectPlaylistState,
    (state) => state.playlists
);

export const selectSelectedPlaylist = createSelector(
    selectPlaylistState,
    (state) => state.selectedPlaylist
);

export const selectPlaylistsLoading = createSelector(
    selectPlaylistState,
    (state) => state.loading
);

export const selectPlaylistsError = createSelector(
    selectPlaylistState,
    (state) => state.error
);

export const selectPlaylistsCount = createSelector(
    selectAllPlaylists,
    (playlists) => playlists.length
);

export const selectPlaylistById = (playlistId: number) => createSelector(
    selectAllPlaylists,
    (playlists) => playlists.find(p => p.id === playlistId)
);
