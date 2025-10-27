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
exports.LikedSongsController = void 0;
const common_1 = require("@nestjs/common");
const liked_songs_service_1 = require("./liked-songs.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let LikedSongsController = class LikedSongsController {
    constructor(likedSongsService) {
        this.likedSongsService = likedSongsService;
    }
    async likeSong(req, body) {
        return this.likedSongsService.likeSong(req.user.id, body);
    }
    async unlikeSong(req, trackId) {
        await this.likedSongsService.unlikeSong(req.user.id, trackId);
        return { success: true };
    }
    async getUserLikedSongs(req) {
        return this.likedSongsService.getUserLikedSongs(req.user.id);
    }
    async checkIfLiked(req, trackId) {
        const isLiked = await this.likedSongsService.isLiked(req.user.id, trackId);
        return { isLiked };
    }
};
exports.LikedSongsController = LikedSongsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LikedSongsController.prototype, "likeSong", null);
__decorate([
    (0, common_1.Delete)(':trackId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('trackId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LikedSongsController.prototype, "unlikeSong", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LikedSongsController.prototype, "getUserLikedSongs", null);
__decorate([
    (0, common_1.Get)(':trackId/check'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('trackId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LikedSongsController.prototype, "checkIfLiked", null);
exports.LikedSongsController = LikedSongsController = __decorate([
    (0, common_1.Controller)('liked-songs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [liked_songs_service_1.LikedSongsService])
], LikedSongsController);
//# sourceMappingURL=liked-songs.controller.js.map