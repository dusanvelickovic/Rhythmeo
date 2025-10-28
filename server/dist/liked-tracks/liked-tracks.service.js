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
exports.LikedTracksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const liked_track_entity_1 = require("./liked-track.entity");
let LikedTracksService = class LikedTracksService {
    constructor(likedTracksRepository) {
        this.likedTracksRepository = likedTracksRepository;
    }
    async likeTrack(userId, trackData) {
        const existingLike = await this.likedTracksRepository.findOne({
            where: { userId, trackId: trackData.trackId },
        });
        if (existingLike) {
            return existingLike;
        }
        const likedTrack = this.likedTracksRepository.create({
            userId,
            ...trackData,
        });
        return this.likedTracksRepository.save(likedTrack);
    }
    async unlikeTrack(userId, trackId) {
        await this.likedTracksRepository.delete({ userId, trackId });
    }
    async isLiked(userId, trackId) {
        const count = await this.likedTracksRepository.count({
            where: { userId, trackId },
        });
        return count > 0;
    }
    async getUserLikedTracks(userId) {
        return this.likedTracksRepository.find({
            where: { userId },
            order: { likedAt: 'DESC' },
        });
    }
};
exports.LikedTracksService = LikedTracksService;
exports.LikedTracksService = LikedTracksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(liked_track_entity_1.LikedTrack)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], LikedTracksService);
//# sourceMappingURL=liked-tracks.service.js.map