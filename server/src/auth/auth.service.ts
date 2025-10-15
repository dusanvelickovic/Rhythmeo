import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

export interface SpotifyTokenResponse {
    access_token: string;
    token_type: string;
    scope: string;
    expires_in: number;
    refresh_token: string;
}

@Injectable()
export class AuthService {
    private clientId = process.env.SPOTIFY_CLIENT_ID;
    private redirectUri = process.env.SPOTIFY_REDIRECT_URI;
    private scopes = 'user-read-private user-read-email';
    private verifier = this.generateCodeVerifier(128);

    /**
     * Generate Spotify authorization URL with PKCE
     */
    async getSpotifyAuthUrl(): Promise<string> {
        const challenge = await this.generateCodeChallenge(this.verifier);

        const params = new URLSearchParams();
        params.append('client_id', this.clientId);
        params.append('response_type', 'code');
        params.append('redirect_uri', this.redirectUri);
        params.append('scope', this.scopes);
        params.append('code_challenge_method', 'S256');
        params.append('code_challenge', challenge);

        return `https://accounts.spotify.com/authorize?${params.toString()}`;
    }

    /**
     * Exchange authorization code for access and refresh tokens
     */
    async exchangeCodeForTokens(code: string): Promise<SpotifyTokenResponse> {
        const params = new URLSearchParams();
        params.append('client_id', this.clientId);
        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append('redirect_uri', this.redirectUri);
        params.append('code_verifier', this.verifier);

        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params,
        });

        if (!result.ok) {
            throw new Error('Failed to exchange code for tokens');
        }

        return await result.json();
    }

    /**
     * Validate Spotify access token by calling Spotify API
     */
    async validateSpotifyToken(accessToken: string): Promise<{ valid: boolean; profile?: any }> {
        const result = await fetch('https://api.spotify.com/v1/me', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (result.ok) {
            const profile = await result.json();
            return { valid: true, profile };
        } else {
            return { valid: false };
        }
    }

    /**
     * Generate a random code verifier for PKCE
     */
    private generateCodeVerifier(length: number): string {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }

    /**
     * Generate code challenge from verifier using SHA256
     */
    private async generateCodeChallenge(codeVerifier: string): Promise<string> {
        const data = new TextEncoder().encode(codeVerifier);
        const digest = await crypto.subtle.digest('SHA-256', data);
        return btoa(String.fromCharCode(...new Uint8Array(digest)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }
}
