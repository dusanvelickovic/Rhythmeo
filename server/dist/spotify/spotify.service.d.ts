import { HttpService } from '@nestjs/axios';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '@nestjs/config';
export declare class SpotifyService {
    private readonly http;
    private readonly authService;
    private readonly configService;
    private readonly spotifyApiUrl;
    constructor(http: HttpService, authService: AuthService, configService: ConfigService);
    getUsersTopTracks(spotifyId: string, timeRange?: 'short_term' | 'medium_term' | 'long_term', limit?: number): Promise<any[]>;
}
