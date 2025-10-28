import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PlayerState } from './player.state';

export const selectPlayerState = createFeatureSelector<PlayerState>('player');

export const selectIsReady = createSelector(
    selectPlayerState,
    (state: PlayerState) => state.isReady
);

export const selectDeviceId = createSelector(
    selectPlayerState,
    (state: PlayerState) => state.deviceId
);

export const selectIsPaused = createSelector(
    selectPlayerState,
    (state: PlayerState) => state.paused
);

export const selectCurrentTrack = createSelector(
    selectPlayerState,
    (state: PlayerState) => state.current_track
);

export const selectPosition = createSelector(
    selectPlayerState,
    (state: PlayerState) => state.position
);

export const selectDuration = createSelector(
    selectPlayerState,
    (state: PlayerState) => state.duration
);

export const selectVolume = createSelector(
    selectPlayerState,
    (state: PlayerState) => state.volume
);

export const selectNextTracks = createSelector(
    selectPlayerState,
    (state: PlayerState) => state.nextTracks
);

export const selectPreviousTracks = createSelector(
    selectPlayerState,
    (state: PlayerState) => state.previousTracks
);

export const selectError = createSelector(
    selectPlayerState,
    (state: PlayerState) => state.error
);
