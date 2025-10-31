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
exports.PlaylistService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const playlist_entity_1 = require("./playlist.entity");
const spotify_service_1 = require("../spotify/spotify.service");
const users_service_1 = require("../users/users.service");
let PlaylistService = class PlaylistService {
    constructor(playlistRepository, spotifyService, userService) {
        this.playlistRepository = playlistRepository;
        this.spotifyService = spotifyService;
        this.userService = userService;
    }
    async getUserPlaylists(userId) {
        const playlists = await this.playlistRepository
            .createQueryBuilder('playlist')
            .leftJoin('playlist_tracks', 'pt', 'pt.playlistId = playlist.id')
            .where('playlist.userId = :userId', { userId })
            .select([
            'playlist.id',
            'playlist.userId',
            'playlist.name',
            'playlist.createdAt',
            'playlist.updatedAt',
            'COUNT(pt.id) as trackCount',
            'MIN(pt.trackId) as firstTrackId'
        ])
            .groupBy('playlist.id')
            .orderBy('playlist.createdAt', 'DESC')
            .getRawMany();
        const userSpotifyId = await this.userService.getSpotifyIdById(userId);
        const playlistsWithImages = await Promise.all(playlists.map(async (playlist) => {
            let imageUrl = null;
            if (playlist.firsttrackid) {
                try {
                    const trackData = await this.spotifyService.getTrackById(userSpotifyId, playlist.firsttrackid);
                    if (trackData?.album?.images?.[0]?.url) {
                        imageUrl = trackData.album.images[0].url;
                    }
                }
                catch (error) {
                    console.error(`Failed to fetch cover for playlist ${playlist.playlist_id}:`, error.message);
                }
            }
            return {
                id: playlist.playlist_id,
                userId: playlist.playlist_userId,
                name: playlist.playlist_name,
                createdAt: playlist.playlist_createdAt,
                updatedAt: playlist.playlist_updatedAt,
                trackCount: parseInt(playlist.trackcount) || 0,
                imageUrl
            };
        }));
        return playlistsWithImages;
    }
    async createPlaylist(createPlaylistDto) {
        const playlist = this.playlistRepository.create(createPlaylistDto);
        return this.playlistRepository.save(playlist);
    }
    async getPlaylistById(id, userId) {
        const playlist = await this.playlistRepository.findOne({ where: { id } });
        if (!playlist) {
            throw new common_1.NotFoundException(`Playlist with ID ${id} not found`);
        }
        if (playlist.userId !== userId) {
            throw new common_1.ForbiddenException('You do not have access to this playlist');
        }
        return playlist;
    }
    async updatePlaylist(id, userId, updatePlaylistDto) {
        const playlist = await this.getPlaylistById(id, userId);
        Object.assign(playlist, updatePlaylistDto);
        return this.playlistRepository.save(playlist);
    }
    async deletePlaylist(id, userId) {
        const playlist = await this.getPlaylistById(id, userId);
        await this.playlistRepository.remove(playlist);
        return true;
    }
};
exports.PlaylistService = PlaylistService;
exports.PlaylistService = PlaylistService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(playlist_entity_1.Playlist)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        spotify_service_1.SpotifyService,
        users_service_1.UsersService])
], PlaylistService);
//# sourceMappingURL=playlist.service.js.map