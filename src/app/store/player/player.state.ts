import { Track } from '../../core/types/track';

export interface PlayerState {
    paused: boolean;
    position: number;
    duration: number;
    current_track: Track | null;
    nextTracks: Track[];
    previousTracks: Track[];
    isReady: boolean;
    deviceId: string | null;
    volume: number;
    error: any;
}

export const initialPlayerState: PlayerState = {
    paused: true,
    position: 0,
    duration: 0,
    current_track: null,
    nextTracks: [],
    previousTracks: [],
    isReady: false,
    deviceId: null,
    volume: 20,
    error: null,
};
