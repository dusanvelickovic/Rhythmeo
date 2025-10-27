import { Controller, Post, Delete, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { LikedSongsService } from './liked-songs.service';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';
import {LikedSong} from './liked-song.entity';

@Controller('liked-songs')
@UseGuards(JwtAuthGuard)
export class LikedSongsController {
    constructor(
        private readonly likedSongsService: LikedSongsService,
    ) {}

    /**
     * Like a song
     */
    @Post()
    @UseGuards(JwtAuthGuard)
    async likeSong(@Request() req: any, @Body() body: {
        trackId: string;
        trackName: string;
        artistName?: string;
        albumName?: string;
        imageUrl?: string;
    }): Promise<LikedSong> {
        return this.likedSongsService.likeSong(req.user.id, body);
    }

    /**
     * Unlike a song by its track ID
     */
    @Delete(':trackId')
    @UseGuards(JwtAuthGuard)
    async unlikeSong(@Request() req: any, @Param('trackId') trackId: string): Promise<{ success: boolean }> {
        await this.likedSongsService.unlikeSong(req.user.id, trackId);
        return { success: true };
    }

    /**
     * Get all liked songs for the authenticated user
     */
    @Get()
    @UseGuards(JwtAuthGuard)
    async getUserLikedSongs(@Request() req: any): Promise<LikedSong[]> {
        return this.likedSongsService.getUserLikedSongs(req.user.id);
    }

    /**
     * Check if a track is liked by the user
     */
    @Get(':trackId/check')
    @UseGuards(JwtAuthGuard)
    async checkIfLiked(@Request() req: any, @Param('trackId') trackId: string): Promise<{ isLiked: boolean }> {
        const isLiked: boolean = await this.likedSongsService.isLiked(req.user.id, trackId);
        return { isLiked };
    }
}
