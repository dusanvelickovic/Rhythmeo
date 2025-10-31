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
exports.PlaylistController = void 0;
const common_1 = require("@nestjs/common");
const playlist_service_1 = require("./playlist.service");
const playlist_track_service_1 = require("../playlist-track/playlist-track.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let PlaylistController = class PlaylistController {
    constructor(playlistService, playlistTrackService) {
        this.playlistService = playlistService;
        this.playlistTrackService = playlistTrackService;
    }
    async getUserPlaylists(req) {
        const userId = req.user.id;
        return this.playlistService.getUserPlaylists(userId);
    }
    async createPlaylist(req, createPlaylistDto) {
        const userId = req.user.id;
        return this.playlistService.createPlaylist({ ...createPlaylistDto, userId });
    }
    async getPlaylist(req, id) {
        const userId = req.user.id;
        return this.playlistService.getPlaylistById(id, userId);
    }
    async updatePlaylist(req, id, updatePlaylistDto) {
        const userId = req.user.id;
        return this.playlistService.updatePlaylist(id, userId, updatePlaylistDto);
    }
    async deletePlaylist(req, id) {
        const userId = req.user.id;
        await this.playlistTrackService.deleteTracksByPlaylistId(id);
        const success = await this.playlistService.deletePlaylist(id, userId);
        return { success };
    }
    async addTrackToPlaylist(req, id, body) {
        const userId = req.user.id;
        await this.playlistService.getPlaylistById(id, userId);
        const success = await this.playlistTrackService.addTrackToPlaylist(id, body.trackId);
        return { success };
    }
    async getPlaylistTracks(req, id) {
        const userId = req.user.id;
        await this.playlistService.getPlaylistById(id, userId);
        const tracks = await this.playlistTrackService.getPlaylistTracks(id);
        return tracks;
    }
    async removeTrackFromPlaylist(req, id, trackId) {
        const userId = req.user.id;
        await this.playlistService.getPlaylistById(id, userId);
        const success = await this.playlistTrackService.removeTrackFromPlaylist(id, trackId);
        return { success };
    }
};
exports.PlaylistController = PlaylistController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "getUserPlaylists", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "createPlaylist", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "getPlaylist", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "updatePlaylist", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "deletePlaylist", null);
__decorate([
    (0, common_1.Post)(':id/tracks'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "addTrackToPlaylist", null);
__decorate([
    (0, common_1.Get)(':id/tracks'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "getPlaylistTracks", null);
__decorate([
    (0, common_1.Delete)(':id/tracks/:trackId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('trackId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, String]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "removeTrackFromPlaylist", null);
exports.PlaylistController = PlaylistController = __decorate([
    (0, common_1.Controller)('playlists'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [playlist_service_1.PlaylistService,
        playlist_track_service_1.PlaylistTrackService])
], PlaylistController);
//# sourceMappingURL=playlist.controller.js.map