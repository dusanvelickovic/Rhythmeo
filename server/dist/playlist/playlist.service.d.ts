import { Repository } from 'typeorm';
import { Playlist } from './playlist.entity';
export interface CreatePlaylistDto {
    userId: string;
    name: string;
}
export interface UpdatePlaylistDto {
    name?: string;
}
export declare class PlaylistService {
    private playlistRepository;
    constructor(playlistRepository: Repository<Playlist>);
    getUserPlaylists(userId: string): Promise<any[]>;
    createPlaylist(createPlaylistDto: CreatePlaylistDto): Promise<Playlist>;
    getPlaylistById(id: number, userId: string): Promise<Playlist>;
    updatePlaylist(id: number, userId: string, updatePlaylistDto: UpdatePlaylistDto): Promise<Playlist>;
    deletePlaylist(id: number, userId: string): Promise<boolean>;
}
