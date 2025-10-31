import { Repository } from 'typeorm';
import { Playlist } from './playlist.entity';
import { SpotifyService } from '../spotify/spotify.service';
import { UsersService } from '../users/users.service';
export interface CreatePlaylistDto {
    userId: string;
    name: string;
}
export interface UpdatePlaylistDto {
    name?: string;
}
export declare class PlaylistService {
    private playlistRepository;
    private spotifyService;
    private userService;
    constructor(playlistRepository: Repository<Playlist>, spotifyService: SpotifyService, userService: UsersService);
    getUserPlaylists(userId: string): Promise<any[]>;
    createPlaylist(createPlaylistDto: CreatePlaylistDto): Promise<Playlist>;
    getPlaylistById(id: number, userId: string): Promise<Playlist>;
    updatePlaylist(id: number, userId: string, updatePlaylistDto: UpdatePlaylistDto): Promise<Playlist>;
    deletePlaylist(id: number, userId: string): Promise<boolean>;
}
