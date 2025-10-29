import { Repository } from 'typeorm';
import { PlaylistTrack } from './playlist-track.entity';
export declare class PlaylistTrackService {
    private playlistTrackRepository;
    constructor(playlistTrackRepository: Repository<PlaylistTrack>);
    addTrackToPlaylist(playlistId: number, trackId: string): Promise<boolean>;
    removeTrackFromPlaylist(playlistId: number, trackId: string): Promise<boolean>;
    getPlaylistTracks(playlistId: number): Promise<PlaylistTrack[]>;
}
