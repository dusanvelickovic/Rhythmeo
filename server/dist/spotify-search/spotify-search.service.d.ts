import { HttpService } from '@nestjs/axios';
import { AuthService } from '../auth/auth.service';
export declare class SpotifySearchService {
    private readonly http;
    private readonly authService;
    private readonly spotifyApiUrl;
    constructor(http: HttpService, authService: AuthService);
    search(spotifyId: string, query: string, type?: string, limit?: number): Promise<any>;
}
