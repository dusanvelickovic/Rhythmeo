import {Controller, Get, Post, Body, Req, UseGuards, Query} from '@nestjs/common';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';
import {SpotifyService} from './spotify.service';
import {User} from '../users/user.entity';

@Controller('spotify')
export class SpotifyController {
    constructor(private readonly spotifyService: SpotifyService) {}

    @Get('top-tracks')
    @UseGuards(JwtAuthGuard)
    async getUsersTopTracks(
        @Req() req: any,
        @Query('timeRange') timeRange?: 'short_term' | 'medium_term' | 'long_term',
        @Query('limit') limit?: number,
    ) {
        return this.spotifyService.getUsersTopTracks(
            req.user.spotifyId,
            timeRange || 'medium_term',
            limit || 20,
        );
    }

    @Post('tracks')
    @UseGuards(JwtAuthGuard)
    async getTracks(
        @Req() req: any,
        @Body() body: { trackIds: string[] },
    ) {
        return this.spotifyService.getTracksByIds(req.user.spotifyId, body.trackIds);
    }
}
