import { createReducer, on } from '@ngrx/store';
import { PlayerState, initialPlayerState } from './player.state';
import * as PlayerActions from './player.actions';

export const playerReducer = createReducer(
    initialPlayerState,
    on(PlayerActions.playerReady, (state, { deviceId }) => ({
        ...state,
        isReady: true,
        deviceId,
        error: null,
    })),
    on(PlayerActions.playerNotReady, (state) => ({
        ...state,
        isReady: false,
    })),
    on(PlayerActions.updatePlayerState, (state, { paused, position, duration, current_track, nextTracks, previousTracks }) => ({
        ...state,
        paused,
        position,
        duration,
        current_track,
        nextTracks,
        previousTracks,
    })),
    on(PlayerActions.setVolume, (state, { volume }) => ({
        ...state,
        volume,
    })),
    on(PlayerActions.updatePosition, (state, { position }) => ({
        ...state,
        position: Math.min(position, state.duration),
    })),
    on(PlayerActions.playerError, (state, { error }) => ({
        ...state,
        error,
    })),
    on(PlayerActions.cleanupPlayerState, () => initialPlayerState),
    on(PlayerActions.disconnect, () => initialPlayerState)
);
