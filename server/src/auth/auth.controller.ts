import {Controller, Get, Query, Req, Res} from '@nestjs/common';
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    private frontendUri = process.env.FRONTEND_BASE_URL;

    constructor(private readonly authService: AuthService) {}

    @Get('spotify')
    async getSpotifyLoginUrl() {
        const redirectUrl = await this.authService.getSpotifyAuthUrl();
        return { redirectUrl };
    }

    @Get('spotify/callback')
    async handleSpotifyCallback(
        @Query('code') code: string,
        @Res() res: ExpressResponse,
    ) {
        try {
            // Exchange authorization code for tokens using AuthService
            const tokens = await this.authService.exchangeCodeForTokens(code);

            console.log("Writing Spotify token to cookie: ", tokens.access_token);

            // Save access token in HTTP-only cookie
            // Note: Setting domain to localhost allows cookie to work across ports
            res.cookie('access_token', tokens.access_token, {
                httpOnly: true,
                sameSite: 'lax',
                secure: false, // set to true in production with HTTPS
                maxAge: tokens.expires_in * 1000,
                path: '/',
            });

            console.log("Spotify access token cookie set");
            console.log("Set-Cookie header:", res.getHeader('Set-Cookie'));

            // TODO: Save tokens in database as needed

            // Redirect to Angular frontend
            res.redirect(this.frontendUri + `/home`);
        } catch (error) {
            console.error('Spotify callback error:', error);
            res.redirect(this.frontendUri + '/error');
        }
    }

    @Get('spotify/check')
    async checkSpotifyToken(@Req() req: ExpressRequest, @Res() res: ExpressResponse) {
        console.log("=== Checking Spotify Token ===");
        console.log("All cookies received:", req.cookies);
        console.log("Cookie header:", req.headers.cookie);

        const accessToken = req.cookies['access_token'];
        console.log("Spotify access token:", accessToken);

        // If no token, user is not logged in
        if (!accessToken) {
            console.log("No access token found - returning 401");
            return res.status(401).json({ valid: false });
        }

        // Validate the access token using AuthService
        const validation = await this.authService.validateSpotifyToken(accessToken);

        if (validation.valid) {
            console.log("Token is valid");
            return res.json({ valid: true, profile: validation.profile });
        } else {
            console.log("Token is invalid");
            return res.status(401).json({ valid: false });
        }
    }
}
