import { Response as ExpressResponse } from 'express';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
export declare class AuthController {
    private readonly authService;
    private readonly configService;
    constructor(authService: AuthService, configService: ConfigService);
    private frontendUrl;
    spotifyLogin(): void;
    spotifyAuthRedirect(req: any, res: ExpressResponse): Promise<void>;
    getSpotifyToken(req: any): Promise<{
        accessToken: string;
    }>;
    getProfile(req: any): Promise<{
        id: string;
        spotifyId: string;
        displayName: string;
        email: string;
        profileImage: string;
    }>;
}
