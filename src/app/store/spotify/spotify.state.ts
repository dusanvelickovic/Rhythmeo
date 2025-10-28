import { Track } from '../../core/types/track';

export interface SpotifyState {
    topTracks: Track[];
    topTracksLoading: boolean;
    topTracksError: any;
    tracks: Track[];
    tracksLoading: boolean;
    tracksError: any;
}

export const initialSpotifyState: SpotifyState = {
    topTracks: [],
    topTracksLoading: false,
    topTracksError: null,
    tracks: [],
    tracksLoading: false,
    tracksError: null,
};
