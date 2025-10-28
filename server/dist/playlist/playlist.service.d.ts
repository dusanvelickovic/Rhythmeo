import { Repository } from 'typeorm';
import { Playlist } from './playlist.entity';
export declare class PlaylistService {
    private playlistRepository;
    constructor(playlistRepository: Repository<Playlist>);
}
