import { SpotifySearchService } from './spotify-search.service';
import { User } from '../users/user.entity';
export declare class SpotifySearchController {
    private readonly spotifySearchService;
    constructor(spotifySearchService: SpotifySearchService);
    search(user: User, query: string, type?: string, limit?: number): Promise<any>;
}
