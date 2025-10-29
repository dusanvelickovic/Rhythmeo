import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { PlaylistService, CreatePlaylistDto, UpdatePlaylistDto } from './playlist.service';
import { PlaylistTrackService } from '../playlist-track/playlist-track.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('playlists')
@UseGuards(JwtAuthGuard)
export class PlaylistController {
    constructor(
        private readonly playlistService: PlaylistService,
        private readonly playlistTrackService: PlaylistTrackService
    ) {}

    /**
     * Get all playlists for the authenticated user
     */
    @Get()
    @UseGuards(JwtAuthGuard)
    async getUserPlaylists(@Request() req: any) {
        const userId = req.user.id;
        return this.playlistService.getUserPlaylists(userId);
    }

    /**
     * Create a new playlist for the authenticated user
     */
    @Post()
    @UseGuards(JwtAuthGuard)
    async createPlaylist(@Request() req: any, @Body() createPlaylistDto: Omit<CreatePlaylistDto, 'userId'>) {
        const userId = req.user.id;
        return this.playlistService.createPlaylist({ ...createPlaylistDto, userId });
    }

    /**
     * Get a specific playlist by ID for the authenticated user
     */
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async getPlaylist(@Request() req: any, @Param('id') id: number) {
        const userId = req.user.id;
        return this.playlistService.getPlaylistById(id, userId);
    }

    /**
     * Update a playlist for the authenticated user
     */
    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async updatePlaylist(
        @Request() req: any,
        @Param('id') id: number,
        @Body() updatePlaylistDto: UpdatePlaylistDto
    ) {
        const userId = req.user.id;
        return this.playlistService.updatePlaylist(id, userId, updatePlaylistDto);
    }

    /**
     * Delete a playlist for the authenticated user
     */
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deletePlaylist(@Request() req: any, @Param('id') id: number) {
        const userId = req.user.id;

        // Delete all tracks associated with the playlist
        await this.playlistTrackService.deleteTracksByPlaylistId(id);

        // Delete the playlist
        const success = await this.playlistService.deletePlaylist(id, userId);

        return { success };
    }

    /**
     * Add a track to a playlist for the authenticated user
     */
    @Post(':id/tracks')
    @UseGuards(JwtAuthGuard)
    async addTrackToPlaylist(
        @Request() req: any,
        @Param('id') id: number,
        @Body() body: { trackId: string }
    ) {
        const userId = req.user.id;
        // Verify user owns the playlist
        await this.playlistService.getPlaylistById(id, userId);
        const success = await this.playlistTrackService.addTrackToPlaylist(id, body.trackId);
        return { success };
    }

    /**
     * Get all tracks in a playlist for the authenticated user
     */
    @Get(':id/tracks')
    @UseGuards(JwtAuthGuard)
    async getPlaylistTracks(
        @Request() req: any,
        @Param('id') id: number
    ) {
        const userId = req.user.id;
        // Verify user owns the playlist
        await this.playlistService.getPlaylistById(id, userId);
        const tracks = await this.playlistTrackService.getPlaylistTracks(id);
        return tracks;
    }

    /**
     * Remove a track from a playlist for the authenticated user
     */
    @Delete(':id/tracks/:trackId')
    @UseGuards(JwtAuthGuard)
    async removeTrackFromPlaylist(
        @Request() req: any,
        @Param('id') id: number,
        @Param('trackId') trackId: string
    ) {
        const userId = req.user.id;
        // Verify user owns the playlist
        await this.playlistService.getPlaylistById(id, userId);
        const success = await this.playlistTrackService.removeTrackFromPlaylist(id, trackId);
        return { success };
    }
}
