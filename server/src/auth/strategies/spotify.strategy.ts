import { PassportStrategy } from '@nestjs/passport';
import {Profile, Strategy, VerifyCallback} from 'passport-spotify';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SpotifyStrategy extends PassportStrategy(Strategy, 'spotify') {
    constructor(private configService: ConfigService) {
        super({
            clientID: configService.get('SPOTIFY_CLIENT_ID'),
            clientSecret: configService.get('SPOTIFY_CLIENT_SECRET'),
            callbackURL: configService.get('SPOTIFY_REDIRECT_URI'),
            scope: [
                'user-read-email',
                'user-read-private',
                'user-top-read',
                'user-read-recently-played',
                'playlist-read-private',
            ],
        });
    }

    /**
     * Automatically called by Passport after successful authentication.
     */
    async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<any> {
        return {
            profile,
            accessToken,
            refreshToken,
        };
    }
}
