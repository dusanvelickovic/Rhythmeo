import { createAction, props } from '@ngrx/store';
import { Track } from '../../core/types/track';

export const initializePlayer = createAction('[Player] Initialize Player');

export const playerReady = createAction(
    '[Player] Player Ready',
    props<{ deviceId: string }>()
);

export const playerNotReady = createAction('[Player] Player Not Ready');

export const updatePlayerState = createAction(
    '[Player] Update Player State',
    props<{
        paused: boolean;
        position: number;
        duration: number;
        current_track: Track | null;
        nextTracks: Track[];
        previousTracks: Track[];
    }>()
);

export const play = createAction(
    '[Player] Play',
    props<{ uri?: string }>()
);

export const pause = createAction('[Player] Pause');

export const resume = createAction('[Player] Resume');

export const togglePlay = createAction('[Player] Toggle Play');

export const nextTrack = createAction('[Player] Next Track');

export const previousTrack = createAction('[Player] Previous Track');

export const seek = createAction(
    '[Player] Seek',
    props<{ position: number }>()
);

export const setVolume = createAction(
    '[Player] Set Volume',
    props<{ volume: number }>()
);

export const updatePosition = createAction(
    '[Player] Update Position',
    props<{ position: number }>()
);

export const playerError = createAction(
    '[Player] Player Error',
    props<{ error: any }>()
);

export const cleanupPlayerState = createAction('[Player] Cleanup Player State');

export const disconnect = createAction('[Player] Disconnect');
