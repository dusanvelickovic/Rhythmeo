import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SpotifySearchService } from './spotify-search.service';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';
import {CurrentUser} from '../auth/decorators/current-user.decorator';
import {User} from '../users/user.entity';

@Controller('spotify-search')
@UseGuards(JwtAuthGuard)
export class SpotifySearchController {
    constructor(private readonly spotifySearchService: SpotifySearchService) {}

    /**
     * Search Spotify for tracks, artists.
     */
    @Get()
    async search(
        @CurrentUser() user: User,
        @Query('query') query: string,
        @Query('type') type: string = 'track',
        @Query('limit') limit: number = 20,
    ) {
        console.log(query);
        console.log(type);

        const result = await this.spotifySearchService.search(
            user.spotifyId,
            query,
            type,
            limit,
        );

        if (type === 'track' && result.tracks) {
            return result.tracks.items;
        }

        return result;
    }
}
