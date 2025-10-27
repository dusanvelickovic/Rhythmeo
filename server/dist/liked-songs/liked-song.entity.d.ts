import { User } from '../users/user.entity.js';
export declare class LikedSong {
    id: number;
    userId: string;
    trackId: string;
    trackName: string;
    artistName?: string;
    albumName?: string;
    imageUrl?: string;
    likedAt: Date;
    user: User;
}
