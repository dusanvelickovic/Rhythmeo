import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlaylistTrack } from './playlist-track.entity';

@Injectable()
export class PlaylistTrackService {
    constructor(
        @InjectRepository(PlaylistTrack)
        private playlistTrackRepository: Repository<PlaylistTrack>,
    ) {}
}
