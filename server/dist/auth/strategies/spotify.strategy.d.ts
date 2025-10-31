import { Profile } from 'passport-spotify';
import { ConfigService } from '@nestjs/config';
declare const SpotifyStrategy_base: new (...args: any) => any;
export declare class SpotifyStrategy extends SpotifyStrategy_base {
    private configService;
    constructor(configService: ConfigService);
    validate(accessToken: string, refreshToken: string, profile: Profile): Promise<any>;
}
export {};
