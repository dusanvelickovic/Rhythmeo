import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Playlist } from './playlist.entity';

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
    ) {}

    /**
     * Get all playlists for a specific user
     */
    async getUserPlaylists(userId: string): Promise<Playlist[]> {
        return this.playlistRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' }
        });
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
