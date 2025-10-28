import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LikedTrack } from './liked-track.entity';

@Injectable()
export class LikedTracksService {
    constructor(
        @InjectRepository(LikedTrack)
        private likedTracksRepository: Repository<LikedTrack>,
    ) {}

    /**
     * Like a track
     */
    async likeTrack(userId: string, trackData: {
        trackId: string;
        trackName: string;
        artistName?: string;
        albumName?: string;
        imageUrl?: string;
    }): Promise<LikedTrack> {
        const existingLike: LikedTrack = await this.likedTracksRepository.findOne({
            where: { userId, trackId: trackData.trackId },
        });

        if (existingLike) {
            return existingLike;
        }

        const likedTrack: LikedTrack = this.likedTracksRepository.create({
            userId,
            ...trackData,
        });

        return this.likedTracksRepository.save(likedTrack);
    }

    /**
     * Unlike a track by its track ID
     */
    async unlikeTrack(userId: string, trackId: string): Promise<void> {
        await this.likedTracksRepository.delete({ userId, trackId });
    }

    /**
     * Check if a track is liked by the user
     */
    async isLiked(userId: string, trackId: string): Promise<boolean> {
        const count: number = await this.likedTracksRepository.count({
            where: { userId, trackId },
        });
        return count > 0;
    }

    /**
     * Get all liked tracks for a specific user
     */
    async getUserLikedTracks(userId: string): Promise<LikedTrack[]> {
        return this.likedTracksRepository.find({
            where: { userId },
            order: { likedAt: 'DESC' },
        });
    }
}
