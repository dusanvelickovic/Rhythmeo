import {Controller, Get, NotFoundException, Req, Res, UseGuards} from '@nestjs/common';
import { Response as ExpressResponse } from 'express';
import { AuthService } from './auth.service';
import {SpotifyAuthGuard} from './guards/spotify-auth.guard';
import {ConfigService} from '@nestjs/config';
import {JwtAuthGuard} from './guards/jwt-auth.guard';
import {User} from '../users/user.entity';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) {}

    private frontendUrl = this.configService.get("FRONTEND_BASE_URL");

    /**
     * Initiate Spotify OAuth login
     */
    @Get('spotify')
    @UseGuards(SpotifyAuthGuard)
    spotifyLogin(): void {
        return;
    }

    /**
     * Handle Spotify OAuth callback
     */
    @UseGuards(SpotifyAuthGuard)
    @Get('spotify/callback')
    async spotifyAuthRedirect(
        @Req() req: any,
        @Res({ passthrough: false }) res: ExpressResponse,
    ): Promise<void> {
        // Destructure tokens from req set by SpotifyAuthGuard
        const { accessToken, refreshToken, profile: user } = req.user;

        // Update or create user in database
        const dbUser: User = await this.authService.saveUserInfo(accessToken, refreshToken, user);

        // Generate JWT for our app
        const jwt: string = this.authService.login(user, dbUser.id);

        // Redirect to frontend with JWT as query param
        return res.redirect(`${this.frontendUrl}/login-callback?token=${jwt}`);
    }

    /**
     * Get Spotify access token for authenticated user
     */
    @UseGuards(JwtAuthGuard)
    @Get('spotify/token')
    async getSpotifyToken(@Req() req: any): Promise<{ accessToken: string }> {
        const accessToken: string = await this.authService.getAccessToken(req.user.spotifyId);

        if (!accessToken) {
            throw new NotFoundException('Access token not found');
        }

        return {
            accessToken: accessToken,
        };
    }

    /**
     * Get the authenticated user's profile
     */
    @Get('profile')
    @UseGuards(JwtAuthGuard)
    async getProfile(@Req() req: any) {
        // Fetch user from database using spotifyId from JWT payload
        const user = await this.authService.getUserBySpotifyId(req.user.spotifyId);

        return {
            id: user.id,
            spotifyId: user.spotifyId,
            displayName: user.displayName,
            email: user.email,
            profileImage: user.profileImage,
        };
    }
}
