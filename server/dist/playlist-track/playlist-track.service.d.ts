import { Repository } from 'typeorm';
import { PlaylistTrack } from './playlist-track.entity';
export declare class PlaylistTrackService {
    private playlistTrackRepository;
    constructor(playlistTrackRepository: Repository<PlaylistTrack>);
}
