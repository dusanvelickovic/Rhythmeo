import { Repository } from 'typeorm';
import { LikedSong } from './liked-song.entity';
export declare class LikedSongsService {
    private likedSongsRepository;
    constructor(likedSongsRepository: Repository<LikedSong>);
    likeSong(userId: string, trackData: {
        trackId: string;
        trackName: string;
        artistName?: string;
        albumName?: string;
        imageUrl?: string;
    }): Promise<LikedSong>;
    unlikeSong(userId: string, trackId: string): Promise<void>;
    isLiked(userId: string, trackId: string): Promise<boolean>;
    getUserLikedSongs(userId: string): Promise<LikedSong[]>;
}
