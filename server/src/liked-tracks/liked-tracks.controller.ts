import { Controller, Post, Delete, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { LikedTracksService } from './liked-tracks.service';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';
import {LikedTrack} from './liked-track.entity';

@Controller('liked-tracks')
@UseGuards(JwtAuthGuard)
export class LikedTracksController {
    constructor(
        private readonly likedTracksService: LikedTracksService,
    ) {}

    /**
     * Like a track
     */
    @Post()
    @UseGuards(JwtAuthGuard)
    async likeTrack(@Request() req: any, @Body() body: {
        trackId: string;
        trackName: string;
        artistName?: string;
        albumName?: string;
        imageUrl?: string;
    }): Promise<LikedTrack> {
        return this.likedTracksService.likeTrack(req.user.id, body);
    }

    /**
     * Unlike a track by its track ID
     */
    @Delete(':trackId')
    @UseGuards(JwtAuthGuard)
    async unlikeTrack(@Request() req: any, @Param('trackId') trackId: string): Promise<{ success: boolean }> {
        await this.likedTracksService.unlikeTrack(req.user.id, trackId);
        return { success: true };
    }

    /**
     * Get all liked tracks for the authenticated user
     */
    @Get()
    @UseGuards(JwtAuthGuard)
    async getUserLikedTracks(@Request() req: any): Promise<LikedTrack[]> {
        return this.likedTracksService.getUserLikedTracks(req.user.id);
    }

    /**
     * Check if a track is liked by the user
     */
    @Get(':trackId/check')
    @UseGuards(JwtAuthGuard)
    async checkIfLiked(@Request() req: any, @Param('trackId') trackId: string): Promise<{ isLiked: boolean }> {
        const isLiked: boolean = await this.likedTracksService.isLiked(req.user.id, trackId);
        return { isLiked };
    }
}
