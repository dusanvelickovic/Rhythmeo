"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpotifyStrategy = void 0;
const passport_1 = require("@nestjs/passport");
const passport_spotify_1 = require("passport-spotify");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let SpotifyStrategy = class SpotifyStrategy extends (0, passport_1.PassportStrategy)(passport_spotify_1.Strategy, 'spotify') {
    constructor(configService) {
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
                'user-modify-playback-state',
                'streaming',
            ],
        });
        this.configService = configService;
    }
    async validate(accessToken, refreshToken, profile) {
        return {
            profile,
            accessToken,
            refreshToken,
        };
    }
};
exports.SpotifyStrategy = SpotifyStrategy;
exports.SpotifyStrategy = SpotifyStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SpotifyStrategy);
//# sourceMappingURL=spotify.strategy.js.map