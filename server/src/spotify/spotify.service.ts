// spotify.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {firstValueFrom, Observable} from 'rxjs';
import {AuthService} from '../auth/auth.service';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class SpotifyService {
    private readonly spotifyApiUrl: string = 'https://api.spotify.com/v1';

    constructor(
        private readonly http: HttpService,
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) {}

    /**
     * Get user's top tracks from Spotify API
     */
    async getUsersTopTracks(
        spotifyId: string,
        timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term',
        limit: number = 20,
    ): Promise<any[]> {
        const accessToken = await this.authService.getAccessToken(spotifyId);

        const headers = {
            Authorization: `Bearer ${accessToken}`,
        };

        const url = `${this.spotifyApiUrl}/me/top/tracks`;

        try {
            const response = await firstValueFrom(
                this.http.get(url, { headers }),
            );
            return response.data;
        } catch (error) {
            throw new Error(`Spotify API error: ${error.response?.data?.error?.message || error.message}`);
        }
    }
}
