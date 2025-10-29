import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Playlist } from './playlist.entity';
import { SpotifyService } from '../spotify/spotify.service';
import {UsersService} from '../users/users.service';

export interface CreatePlaylistDto {
    userId: string;
    name: string;
}

export interface UpdatePlaylistDto {
    name?: string;
}

@Injectable()
export class PlaylistService {
    constructor(
        @InjectRepository(Playlist)
        private playlistRepository: Repository<Playlist>,
        private spotifyService: SpotifyService,
        private userService: UsersService,
    ) {}

    /**
     * Get all playlists for a specific user
     */
    async getUserPlaylists(userId: string): Promise<any[]> {
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

        // Fetch cover images for each playlist
        const playlistsWithImages = await Promise.all(playlists.map(async (playlist) => {
            let imageUrl = null;

            if (playlist.firsttrackid) {

                try {
                    const trackData = await this.spotifyService.getTrackById(userSpotifyId, playlist.firsttrackid);

                    if (trackData?.album?.images?.[0]?.url) {
                        imageUrl = trackData.album.images[0].url;
                    }
                } catch (error) {
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

    /**
     * Create a new playlist
     */
    async createPlaylist(createPlaylistDto: CreatePlaylistDto): Promise<Playlist> {
        const playlist = this.playlistRepository.create(createPlaylistDto);
        return this.playlistRepository.save(playlist);
    }

    /**
     * Get a specific playlist by ID for a specific user
     */
    async getPlaylistById(id: number, userId: string): Promise<Playlist> {
        const playlist = await this.playlistRepository.findOne({ where: { id } });

        if (!playlist) {
            throw new NotFoundException(`Playlist with ID ${id} not found`);
        }

        if (playlist.userId !== userId) {
            throw new ForbiddenException('You do not have access to this playlist');
        }

        return playlist;
    }

    /**
     * Update a playlist
     */
    async updatePlaylist(id: number, userId: string, updatePlaylistDto: UpdatePlaylistDto): Promise<Playlist> {
        const playlist = await this.getPlaylistById(id, userId);

        Object.assign(playlist, updatePlaylistDto);
        return this.playlistRepository.save(playlist);
    }

    /**
     * Delete a playlist
     */
    async deletePlaylist(id: number, userId: string): Promise<boolean> {
        const playlist = await this.getPlaylistById(id, userId);
        await this.playlistRepository.remove(playlist);
        return true;
    }
}
