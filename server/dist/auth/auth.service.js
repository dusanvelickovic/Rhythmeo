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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const typeorm_2 = require("@nestjs/typeorm");
const rxjs_1 = require("rxjs");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
let AuthService = class AuthService {
    constructor(jwtService, userRepository, configService, http) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.configService = configService;
        this.http = http;
    }
    async getUserBySpotifyId(spotifyId) {
        return this.userRepository.findOne({ where: { spotifyId: spotifyId } });
    }
    async saveUserInfo(accessToken, refreshToken, profile) {
        const spotifyId = profile.id;
        const email = profile.emails?.[0]?.value ?? null;
        const displayName = profile.displayName ?? profile.username ?? null;
        const profileImage = profile.photos?.[0] ?? null;
        const tokenExpiresAt = new Date(Date.now() + 3600 * 1000);
        let user = await this.userRepository.findOne({ where: { spotifyId } });
        if (user) {
            user.accessToken = accessToken;
            user.refreshToken = refreshToken;
            user.tokenExpiresAt = tokenExpiresAt;
            user.email = email;
            user.displayName = displayName;
            user.profileImage = profileImage;
        }
        else {
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
    login(user) {
        const payload = {
            name: user.username,
            spotifyId: user.id,
        };
        return this.jwtService.sign(payload);
    }
    async getAccessToken(spotifyId) {
        const user = await this.userRepository.findOne({ where: { spotifyId } });
        if (!user) {
            throw new Error('User not found');
        }
        const expiresAtCet = user.tokenExpiresAt
            ? user.tokenExpiresAt.toLocaleString('en-US', { timeZone: 'Europe/Berlin', hour12: false })
            : null;
        const nowCet = new Date().toLocaleString('en-US', { timeZone: 'Europe/Berlin', hour12: false });
        if (new Date(expiresAtCet) <= new Date(nowCet)) {
            this.refreshAccessToken(spotifyId).then(async (accessToken) => {
                await this.updateAccessToken(spotifyId, accessToken);
                return accessToken;
            });
        }
        return user.accessToken;
    }
    async getRefreshToken(spotifyId) {
        return this.userRepository
            .findOne({ where: { spotifyId } })
            .then(user => user ? user.refreshToken : null);
    }
    async updateAccessToken(spotifyId, newAccessToken) {
        const user = await this.userRepository.findOne({ where: { spotifyId } });
        if (user) {
            user.accessToken = newAccessToken;
            user.tokenExpiresAt = new Date(Date.now() + 3600 * 1000);
            await this.userRepository.save(user);
        }
    }
    async refreshAccessToken(spotifyId) {
        try {
            const refreshToken = await this.getRefreshToken(spotifyId);
            const clientId = this.configService.get('SPOTIFY_CLIENT_ID');
            const clientSecret = this.configService.get('SPOTIFY_CLIENT_SECRET');
            const response = await (0, rxjs_1.firstValueFrom)(this.http.post('https://accounts.spotify.com/api/token', new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            }).toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
                },
            }));
            return response.data.access_token;
        }
        catch (error) {
            throw new Error(`Failed to refresh access token: ${error.message}`);
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        typeorm_1.Repository,
        config_1.ConfigService,
        axios_1.HttpService])
], AuthService);
//# sourceMappingURL=auth.service.js.map