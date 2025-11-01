import { Profile, Strategy } from 'passport-spotify';
import { ConfigService } from '@nestjs/config';
declare const SpotifyStrategy_base: new (...args: [options: import("passport-spotify").StrategyOptionsWithRequest] | [options: import("passport-spotify").StrategyOptions]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class SpotifyStrategy extends SpotifyStrategy_base {
    private configService;
    constructor(configService: ConfigService);
    validate(accessToken: string, refreshToken: string, profile: Profile): Promise<any>;
}
export {};
