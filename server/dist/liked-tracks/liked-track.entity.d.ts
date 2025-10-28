import { User } from '../users/user.entity';
export declare class LikedTrack {
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
