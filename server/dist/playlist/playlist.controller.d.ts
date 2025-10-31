import { PlaylistService, CreatePlaylistDto, UpdatePlaylistDto } from './playlist.service';
import { PlaylistTrackService } from '../playlist-track/playlist-track.service';
export declare class PlaylistController {
    private readonly playlistService;
    private readonly playlistTrackService;
    constructor(playlistService: PlaylistService, playlistTrackService: PlaylistTrackService);
    getUserPlaylists(req: any): Promise<any[]>;
    createPlaylist(req: any, createPlaylistDto: Omit<CreatePlaylistDto, 'userId'>): Promise<import("./playlist.entity").Playlist>;
    getPlaylist(req: any, id: number): Promise<import("./playlist.entity").Playlist>;
    updatePlaylist(req: any, id: number, updatePlaylistDto: UpdatePlaylistDto): Promise<import("./playlist.entity").Playlist>;
    deletePlaylist(req: any, id: number): Promise<{
        success: boolean;
    }>;
    addTrackToPlaylist(req: any, id: number, body: {
        trackId: string;
    }): Promise<{
        success: boolean;
    }>;
    getPlaylistTracks(req: any, id: number): Promise<import("../playlist-track/playlist-track.entity").PlaylistTrack[]>;
    removeTrackFromPlaylist(req: any, id: number, trackId: string): Promise<{
        success: boolean;
    }>;
}
