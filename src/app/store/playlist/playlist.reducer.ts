import { createReducer, on } from '@ngrx/store';
import { PlaylistState, initialPlaylistState } from './playlist.state';
import * as PlaylistActions from './playlist.actions';

export const playlistReducer = createReducer(
    initialPlaylistState,
    
    // Load Playlists
    on(PlaylistActions.loadPlaylists, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),
    on(PlaylistActions.loadPlaylistsSuccess, (state, { playlists }) => ({
        ...state,
        playlists,
        loading: false,
        error: null,
    })),
    on(PlaylistActions.loadPlaylistsFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),

    // Create Playlist
    on(PlaylistActions.createPlaylist, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),
    on(PlaylistActions.createPlaylistSuccess, (state, { playlist }) => ({
        ...state,
        playlists: [...state.playlists, playlist],
        loading: false,
        error: null,
    })),
    on(PlaylistActions.createPlaylistFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),

    // Add Track to Playlist
    on(PlaylistActions.addTrackToPlaylist, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),
    on(PlaylistActions.addTrackToPlaylistSuccess, (state, { playlistId }) => {
        // Update track count for the playlist
        const updatedPlaylists = state.playlists.map(playlist =>
            playlist.id === playlistId
                ? { ...playlist, trackCount: (playlist.trackCount || 0) + 1 }
                : playlist
        );
        return {
            ...state,
            playlists: updatedPlaylists,
            loading: false,
            error: null,
        };
    }),
    on(PlaylistActions.addTrackToPlaylistFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),

    // Select Playlist
    on(PlaylistActions.selectPlaylist, (state, { playlistId }) => ({
        ...state,
        selectedPlaylist: state.playlists.find(p => p.id === playlistId) || null,
    })),

    // Delete Playlist
    on(PlaylistActions.deletePlaylist, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),
    on(PlaylistActions.deletePlaylistSuccess, (state, { playlistId }) => ({
        ...state,
        playlists: state.playlists.filter(p => p.id !== playlistId),
        selectedPlaylist: state.selectedPlaylist?.id === playlistId ? null : state.selectedPlaylist,
        loading: false,
        error: null,
    })),
    on(PlaylistActions.deletePlaylistFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),

    // Update Playlist
    on(PlaylistActions.updatePlaylist, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),
    on(PlaylistActions.updatePlaylistSuccess, (state, { playlist }) => {
        const updatedPlaylists = state.playlists.map(p =>
            p.id === playlist.id ? playlist : p
        );
        return {
            ...state,
            playlists: updatedPlaylists,
            selectedPlaylist: state.selectedPlaylist?.id === playlist.id ? playlist : state.selectedPlaylist,
            loading: false,
            error: null,
        };
    }),
    on(PlaylistActions.updatePlaylistFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    }))
);
