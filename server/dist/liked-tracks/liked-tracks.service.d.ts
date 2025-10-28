import { Repository } from 'typeorm';
import { LikedTrack } from './liked-track.entity';
export declare class LikedTracksService {
    private likedTracksRepository;
    constructor(likedTracksRepository: Repository<LikedTrack>);
    likeTrack(userId: string, trackData: {
        trackId: string;
        trackName: string;
        artistName?: string;
        albumName?: string;
        imageUrl?: string;
    }): Promise<LikedTrack>;
    unlikeTrack(userId: string, trackId: string): Promise<void>;
    isLiked(userId: string, trackId: string): Promise<boolean>;
    getUserLikedTracks(userId: string): Promise<LikedTrack[]>;
}
