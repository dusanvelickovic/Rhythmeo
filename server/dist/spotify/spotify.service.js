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
exports.SpotifyService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const auth_service_1 = require("../auth/auth.service");
let SpotifyService = class SpotifyService {
    constructor(http, authService) {
        this.http = http;
        this.authService = authService;
        this.spotifyApiUrl = 'https://api.spotify.com/v1';
    }
    async getUsersTopTracks(spotifyId, timeRange = 'medium_term', limit = 20) {
        const accessToken = await this.authService.getAccessToken(spotifyId);
        const headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        const url = `${this.spotifyApiUrl}/me/top/tracks`;
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.http.get(url, { headers }));
            return response.data;
        }
        catch (error) {
            throw new Error(`Spotify API error: ${error.response?.data?.error?.message || error.message}`);
        }
    }
    async getTracksByIds(spotifyId, trackIds) {
        const accessToken = await this.authService.getAccessToken(spotifyId);
        const headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        const url = `${this.spotifyApiUrl}/tracks?ids=${trackIds.join(',')}`;
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.http.get(url, { headers }));
            return response.data;
        }
        catch (error) {
            throw new Error(`Spotify API error: ${error.response?.data?.error?.message || error.message}`);
        }
    }
};
exports.SpotifyService = SpotifyService;
exports.SpotifyService = SpotifyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        auth_service_1.AuthService])
], SpotifyService);
//# sourceMappingURL=spotify.service.js.map