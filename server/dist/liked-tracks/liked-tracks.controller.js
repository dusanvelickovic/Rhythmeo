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
exports.LikedTracksController = void 0;
const common_1 = require("@nestjs/common");
const liked_tracks_service_1 = require("./liked-tracks.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let LikedTracksController = class LikedTracksController {
    constructor(likedTracksService) {
        this.likedTracksService = likedTracksService;
    }
    async likeTrack(req, body) {
        return this.likedTracksService.likeTrack(req.user.id, body);
    }
    async unlikeTrack(req, trackId) {
        await this.likedTracksService.unlikeTrack(req.user.id, trackId);
        return { success: true };
    }
    async getUserLikedTracks(req) {
        return this.likedTracksService.getUserLikedTracks(req.user.id);
    }
    async checkIfLiked(req, trackId) {
        const isLiked = await this.likedTracksService.isLiked(req.user.id, trackId);
        return { isLiked };
    }
};
exports.LikedTracksController = LikedTracksController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LikedTracksController.prototype, "likeTrack", null);
__decorate([
    (0, common_1.Delete)(':trackId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('trackId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LikedTracksController.prototype, "unlikeTrack", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LikedTracksController.prototype, "getUserLikedTracks", null);
__decorate([
    (0, common_1.Get)(':trackId/check'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('trackId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LikedTracksController.prototype, "checkIfLiked", null);
exports.LikedTracksController = LikedTracksController = __decorate([
    (0, common_1.Controller)('liked-tracks'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [liked_tracks_service_1.LikedTracksService])
], LikedTracksController);
//# sourceMappingURL=liked-tracks.controller.js.map