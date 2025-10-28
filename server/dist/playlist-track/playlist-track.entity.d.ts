import { Playlist } from '../playlist/playlist.entity';
export declare class PlaylistTrack {
    id: number;
    playlistId: number;
    trackId: string;
    playlist: Playlist;
}
