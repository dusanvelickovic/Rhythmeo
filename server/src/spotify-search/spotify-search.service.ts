import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class SpotifySearchService {
    private readonly spotifyApiUrl: string = 'https://api.spotify.com/v1';

    constructor(
        private readonly http: HttpService,
        private readonly authService: AuthService,
    ) {}

    /**
     * Search Spotify for tracks, artists, etc.
     */
    async search(
        spotifyId: string,
        query: string,
        type: string = 'track',
        limit: number = 20,
    ): Promise<any> {
        const accessToken = await this.authService.getAccessToken(spotifyId);

        const headers = {
            Authorization: `Bearer ${accessToken}`,
        };

        const url = `${this.spotifyApiUrl}/search`;
        const params = {
            q: query,
            type: type,
            limit: limit.toString(),
        };

        try {
            const response = await firstValueFrom(
                this.http.get(url, { headers, params }),
            );
            return response.data;
        } catch (error) {
            throw new Error(`Spotify API error: ${error.response?.data?.error?.message || error.message}`);
        }
    }
}
