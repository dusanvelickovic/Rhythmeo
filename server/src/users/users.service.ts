import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    /**
     * Find user by Spotify ID
     */
    findBySpotifyId(spotifyId: string) {
        return this.userRepository.findOneBy({ spotifyId });
    }

    /**
     * Get Spotify ID by internal user ID
     */
    async getSpotifyIdById(id: string): Promise<string | null> {
        const user = await this.userRepository
            .findOne({
                where: {id},
                select: ['spotifyId'],
            });
        return user ? user.spotifyId : null;
    }
}
