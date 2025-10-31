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
exports.PlaylistTrackService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const playlist_track_entity_1 = require("./playlist-track.entity");
let PlaylistTrackService = class PlaylistTrackService {
    constructor(playlistTrackRepository) {
        this.playlistTrackRepository = playlistTrackRepository;
    }
    async addTrackToPlaylist(playlistId, trackId) {
        const existing = await this.playlistTrackRepository.findOne({
            where: { playlistId, trackId }
        });
        if (existing) {
            throw new common_1.ConflictException('Track already exists in this playlist');
        }
        const playlistTrack = this.playlistTrackRepository.create({
            playlistId,
            trackId
        });
        await this.playlistTrackRepository.save(playlistTrack);
        return true;
    }
    async removeTrackFromPlaylist(playlistId, trackId) {
        const result = await this.playlistTrackRepository.delete({
            playlistId,
            trackId
        });
        return result.affected ? result.affected > 0 : false;
    }
    async getPlaylistTracks(playlistId) {
        return this.playlistTrackRepository.find({
            where: { playlistId },
            order: { id: 'ASC' }
        });
    }
    async deleteTracksByPlaylistId(playlistId) {
        await this.playlistTrackRepository.delete({ playlistId });
    }
};
exports.PlaylistTrackService = PlaylistTrackService;
exports.PlaylistTrackService = PlaylistTrackService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(playlist_track_entity_1.PlaylistTrack)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PlaylistTrackService);
//# sourceMappingURL=playlist-track.service.js.map