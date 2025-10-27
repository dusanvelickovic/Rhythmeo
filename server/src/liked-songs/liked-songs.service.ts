import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LikedSong } from './liked-song.entity';

@Injectable()
export class LikedSongsService {
    constructor(
        @InjectRepository(LikedSong)
        private likedSongsRepository: Repository<LikedSong>,
    ) {}

    /**
     * Like a song
     */
    async likeSong(userId: string, trackData: {
        trackId: string;
        trackName: string;
        artistName?: string;
        albumName?: string;
        imageUrl?: string;
    }): Promise<LikedSong> {
        const existingLike: LikedSong = await this.likedSongsRepository.findOne({
            where: { userId, trackId: trackData.trackId },
        });

        if (existingLike) {
            return existingLike;
        }

        const likedSong: LikedSong = this.likedSongsRepository.create({
            userId,
            ...trackData,
        });

        return this.likedSongsRepository.save(likedSong);
    }

    /**
     * Unlike a song by its track ID
     */
    async unlikeSong(userId: string, trackId: string): Promise<void> {
        await this.likedSongsRepository.delete({ userId, trackId });
    }

    /**
     * Check if a track is liked by the user
     */
    async isLiked(userId: string, trackId: string): Promise<boolean> {
        const count: number = await this.likedSongsRepository.count({
            where: { userId, trackId },
        });
        return count > 0;
    }

    /**
     * Get all liked songs for a specific user
     */
    async getUserLikedSongs(userId: string): Promise<LikedSong[]> {
        return this.likedSongsRepository.find({
            where: { userId },
            order: { likedAt: 'DESC' },
        });
    }
}
