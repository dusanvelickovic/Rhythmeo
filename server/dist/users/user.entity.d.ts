export declare class User {
    id: string;
    email: string;
    displayName: string;
    spotifyId: string;
    accessToken?: string;
    refreshToken?: string;
    tokenExpiresAt?: Date;
    profileImage?: string;
    createdAt: Date;
    updatedAt: Date;
}
