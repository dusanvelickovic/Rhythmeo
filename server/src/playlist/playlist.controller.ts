import { Controller } from '@nestjs/common';
import { PlaylistService } from './playlist.service';

@Controller('playlists')
export class PlaylistController {
    constructor(private readonly playlistService: PlaylistService) {}
}
