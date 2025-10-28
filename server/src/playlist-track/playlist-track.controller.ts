import { Controller } from '@nestjs/common';
import { PlaylistTrackService } from './playlist-track.service';

@Controller('playlist-tracks')
export class PlaylistTrackController {
    constructor(private readonly playlistTrackService: PlaylistTrackService) {}
}
