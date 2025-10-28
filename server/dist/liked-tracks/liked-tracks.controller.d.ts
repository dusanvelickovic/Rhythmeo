import { LikedTracksService } from './liked-tracks.service';
import { LikedTrack } from './liked-track.entity';
export declare class LikedTracksController {
    private readonly likedTracksService;
    constructor(likedTracksService: LikedTracksService);
    likeTrack(req: any, body: {
        trackId: string;
        trackName: string;
        artistName?: string;
        albumName?: string;
        imageUrl?: string;
    }): Promise<LikedTrack>;
    unlikeTrack(req: any, trackId: string): Promise<{
        success: boolean;
    }>;
    getUserLikedTracks(req: any): Promise<LikedTrack[]>;
    checkIfLiked(req: any, trackId: string): Promise<{
        isLiked: boolean;
    }>;
}
