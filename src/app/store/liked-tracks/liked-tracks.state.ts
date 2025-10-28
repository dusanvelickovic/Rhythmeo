import { LikedTrack } from '../../core/services/liked-tracks.service';

export interface LikedTracksState {
    likedTracks: LikedTrack[];
    likedTrackIds: Set<string>;
    loading: boolean;
    error: any;
}

export const initialLikedTracksState: LikedTracksState = {
    likedTracks: [],
    likedTrackIds: new Set<string>(),
    loading: false,
    error: null,
};
