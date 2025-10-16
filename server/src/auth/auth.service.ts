import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import {JwtService} from '@nestjs/jwt';
import { Profile } from 'passport-spotify';
import {Repository} from 'typeorm';
import {User} from '../users/user.entity';
import {InjectRepository} from '@nestjs/typeorm';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
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
    login(user: Profile): string {
        const payload = {
            name: user.username,
            spotifyId: user.id,
        };

        return this.jwtService.sign(payload);
    }

    // async getUserWithValidToken(userId: string) {
    //     const user = await this.findById(userId);
    //
    //     // Ako je token istekao - refresh
    //     if (user.tokenExpiresAt < now) {
    //         const newTokens = await this.refreshAccessToken(user.refreshToken);
    //         // Ažurira tokene u bazi
    //         await this.usersService.updateTokens(...);
    //     }
    //
    //     return user;
    // }

    /**
     * Generate a random code verifier for PKCE
     */
    // private verifier = this.generateCodeVerifier(128);

    // private generateCodeVerifier(length: number): string {
    //     let text = '';
    //     const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    //
    //     for (let i = 0; i < length; i++) {
    //         text += possible.charAt(Math.floor(Math.random() * possible.length));
    //     }
    //
    //     return text;
    // }

    /**
     * Generate code challenge from verifier using SHA256
     */
    // private generateCodeChallenge(codeVerifier: string): string {
    //     return crypto
    //         .createHash('sha256')
    //         .update(codeVerifier)
    //         .digest('base64url');
    // }
}
