export interface Playlist {
    id: number;
    name: string;
    description?: string;
    imageUrl?: string;
    trackCount?: number;
    userId?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface PlaylistState {
    playlists: Playlist[];
    selectedPlaylist: Playlist | null;
    loading: boolean;
    error: any;
}

export const initialPlaylistState: PlaylistState = {
    playlists: [],
    selectedPlaylist: null,
    loading: false,
    error: null,
};
