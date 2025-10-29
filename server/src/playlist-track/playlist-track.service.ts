import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlaylistTrack } from './playlist-track.entity';

@Injectable()
export class PlaylistTrackService {
    constructor(
        @InjectRepository(PlaylistTrack)
        private playlistTrackRepository: Repository<PlaylistTrack>,
    ) {}

    /**
     * Add a track to a playlist
     */
    async addTrackToPlaylist(playlistId: number, trackId: string): Promise<boolean> {
        // Check if track already exists in playlist
        const existing = await this.playlistTrackRepository.findOne({
            where: { playlistId, trackId }
        });

        if (existing) {
            throw new ConflictException('Track already exists in this playlist');
        }

        const playlistTrack = this.playlistTrackRepository.create({
            playlistId,
            trackId
        });

        await this.playlistTrackRepository.save(playlistTrack);

        return true;
    }

    /**
     * Remove a track from a playlist
     */
    async removeTrackFromPlaylist(playlistId: number, trackId: string): Promise<boolean> {
        const result = await this.playlistTrackRepository.delete({
            playlistId,
            trackId
        });

        return result.affected ? result.affected > 0 : false;
    }

    /**
     * Get all tracks in a playlist
     */
    async getPlaylistTracks(playlistId: number): Promise<PlaylistTrack[]> {
        return this.playlistTrackRepository.find({
            where: { playlistId },
            order: { id: 'ASC' }
        });
    }

    /**
     * Delete all tracks associated with a playlist
     */
    async deleteTracksByPlaylistId(playlistId: number): Promise<void> {
        await this.playlistTrackRepository.delete({ playlistId });
    }
}
