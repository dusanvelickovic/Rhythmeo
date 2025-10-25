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

    async refreshAccessToken(spotifyId: string): Promise<void> {
        try {
            const refreshToken = await this.authService.getRefreshToken(spotifyId);
            const clientId = this.configService.get<string>('SPOTIFY_CLIENT_ID');
            const clientSecret = this.configService.get<string>('SPOTIFY_CLIENT_SECRET');

            const response = await firstValueFrom(
                this.http.post(
                    'https://accounts.spotify.com/api/token',
                    new URLSearchParams({
                        grant_type: 'refresh_token',
                        refresh_token: refreshToken,
                    }).toString(),
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
                        },
                    },
                ),
            );

            // Update the access token in your database
            const newAccessToken = response.data.access_token;
            await this.authService.updateAccessToken(spotifyId, newAccessToken);
        }
        catch (error) {
            throw new Error(`Failed to refresh access token: ${error.message}`);
        }
    }

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
            // If access token expired, refresh it and retry
            if (error.status === 401 ) {
                await this.refreshAccessToken(spotifyId);
                return this.getUsersTopTracks(spotifyId, timeRange, limit);
            }
            throw new Error(`Spotify API error: ${error.response?.data?.error?.message || error.message}`);
        }
    }
}
