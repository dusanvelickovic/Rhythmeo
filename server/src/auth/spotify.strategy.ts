import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-spotify';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SpotifyStrategy extends PassportStrategy(Strategy, 'spotify') {
    constructor() {
        super({
            clientID: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            callbackURL: process.env.SPOTIFY_REDIRECT_URI,
            scope: ['user-read-private', 'user-read-email'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any) {
        // You could store/find the user in DB here
        return { accessToken, profile };
    }
}
