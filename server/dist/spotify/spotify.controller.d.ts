import { SpotifyService } from './spotify.service';
export declare class SpotifyController {
    private readonly spotifyService;
    constructor(spotifyService: SpotifyService);
    getUsersTopTracks(req: any, timeRange?: 'short_term' | 'medium_term' | 'long_term', limit?: number): Promise<any[]>;
}
