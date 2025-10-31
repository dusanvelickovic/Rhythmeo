import { HttpService } from '@nestjs/axios';
import { AuthService } from '../auth/auth.service';
export declare class SpotifyService {
    private readonly http;
    private readonly authService;
    private readonly spotifyApiUrl;
    constructor(http: HttpService, authService: AuthService);
    getUsersTopTracks(spotifyId: string, timeRange?: 'short_term' | 'medium_term' | 'long_term', limit?: number): Promise<any[]>;
    getTracksByIds(spotifyId: string, trackIds: string[]): Promise<any>;
    getTrackById(spotifyId: string, trackId: string): Promise<any>;
}
