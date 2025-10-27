import { Injectable } from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import { Profile } from 'passport-spotify';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly configService: ConfigService,
        private readonly http: HttpService,
    ) {}

    /**
     * Find user by ID
     */
    async getUserBySpotifyId(spotifyId: string): Promise<User | undefined> {
        return this.userRepository.findOne({ where: { spotifyId: spotifyId } });
    }

    /**
     * Save or update user tokens and profile info in the database
     */
    async saveUserInfo(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
    ): Promise<User> {
        const spotifyId = profile.id;
        const email = profile.emails?.[0]?.value ?? null;
        const displayName = profile.displayName ?? profile.username ?? null;
        const profileImage = profile.photos?.[0] ?? null;
        const tokenExpiresAt = new Date(Date.now() + 3600 * 1000); // Default 1 hour

        let user = await this.userRepository.findOne({ where: { spotifyId } });

        if (user) {
            user.accessToken = accessToken;
            user.refreshToken = refreshToken;
            user.tokenExpiresAt = tokenExpiresAt;
            user.email = email;
            user.displayName = displayName;
            user.profileImage = profileImage;
        } else {
            user = this.userRepository.create({
                spotifyId,
                email,
                displayName,
                accessToken,
                refreshToken,
                tokenExpiresAt,
                profileImage,
            });
        }

        return await this.userRepository.save(user);
    }

    /**
     * Generate JWT for authenticated user
     */
    login(user: Profile, dbUserId: string): string {
        const payload = {
            name: user.username,
            spotifyId: user.id,
            id: dbUserId,
        };

        return this.jwtService.sign(payload);
    }

    /**
     * Get user's access token by Spotify ID
     */
    async getAccessToken(spotifyId: string): Promise<string | null> {
        const user = await this.userRepository.findOne({ where: { spotifyId } });
        if (!user) {
            throw new Error('User not found');
        }

        const expiresAtCet: string = user.tokenExpiresAt
            ? user.tokenExpiresAt.toLocaleString('en-US', { timeZone: 'Europe/Berlin', hour12: false })
            : null;

        const nowCet: string = new Date().toLocaleString('en-US', { timeZone: 'Europe/Berlin', hour12: false });

        // If token has expired, refresh it
        if (new Date(expiresAtCet) <= new Date(nowCet)) {
            this.refreshAccessToken(spotifyId).then(async (accessToken) => {
                // Update the access token in database
                await this.updateAccessToken(spotifyId, accessToken);

                return accessToken;
            })
        }

        // If token has NOT expired, return it
        return user.accessToken;
    }

    /**
     * Get user's refresh token by Spotify ID
     */
    async getRefreshToken(spotifyId: string): Promise<string | null> {
        return this.userRepository
            .findOne({ where: { spotifyId } })
            .then(user => user ? user.refreshToken : null);
    }

    /**
     * Update user's access token
     */
    async updateAccessToken(spotifyId: string, newAccessToken: string): Promise<void> {
        const user = await this.userRepository.findOne({ where: { spotifyId } });
        if (user) {
            user.accessToken = newAccessToken;
            user.tokenExpiresAt = new Date(Date.now() + 3600 * 1000);
            await this.userRepository.save(user);
        }
    }

    /**
     * Refresh the Spotify access token using the refresh token
     */
    async refreshAccessToken(spotifyId: string): Promise<string> {
        try {
            const refreshToken = await this.getRefreshToken(spotifyId);
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

            return response.data.access_token;
        }
        catch (error) {
            throw new Error(`Failed to refresh access token: ${error.message}`);
        }
    }
}
