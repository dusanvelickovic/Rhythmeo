import { User } from '../users/user.entity';
export declare class Playlist {
    id: number;
    userId: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
}
