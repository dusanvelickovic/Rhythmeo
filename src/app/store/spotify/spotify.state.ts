import { Track } from '../../core/types/track';

export interface SpotifyState {
    topTracks: Track[];
    topTracksLoading: boolean;
    topTracksError: any;
}

export const initialSpotifyState: SpotifyState = {
    topTracks: [],
    topTracksLoading: false,
    topTracksError: null,
};
