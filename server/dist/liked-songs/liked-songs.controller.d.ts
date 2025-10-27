import { LikedSongsService } from './liked-songs.service';
export declare class LikedSongsController {
    private readonly likedSongsService;
    constructor(likedSongsService: LikedSongsService);
    likeSong(req: any, body: {
        trackId: string;
        trackName: string;
        artistName?: string;
        albumName?: string;
        imageUrl?: string;
    }): Promise<import("./liked-song.entity").LikedSong>;
    unlikeSong(req: any, trackId: string): Promise<{
        success: boolean;
    }>;
    getUserLikedSongs(req: any): Promise<import("./liked-song.entity").LikedSong[]>;
    checkIfLiked(req: any, trackId: string): Promise<{
        isLiked: boolean;
    }>;
}
