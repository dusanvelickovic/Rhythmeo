import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import * as PlayerActions from './player.actions';
import { SpotifyPlayerService } from '../../core/services/spotify-player.service';

@Injectable()
export class PlayerEffects {
    private actions$ = inject(Actions);
    private spotifyPlayerService = inject(SpotifyPlayerService);
    private store = inject(Store);

    initializePlayer$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(PlayerActions.initializePlayer),
                tap(() => this.spotifyPlayerService.initializePlayer())
            ),
        { dispatch: false }
    );

    play$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(PlayerActions.play),
                tap(({ uri }) => this.spotifyPlayerService.play(uri))
            ),
        { dispatch: false }
    );

    pause$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(PlayerActions.pause),
                tap(() => this.spotifyPlayerService.pause())
            ),
        { dispatch: false }
    );

    resume$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(PlayerActions.resume),
                tap(() => this.spotifyPlayerService.resume())
            ),
        { dispatch: false }
    );

    togglePlay$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(PlayerActions.togglePlay),
                tap(() => this.spotifyPlayerService.togglePlay())
            ),
        { dispatch: false }
    );

    nextTrack$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(PlayerActions.nextTrack),
                tap(() => this.spotifyPlayerService.nextTrack())
            ),
        { dispatch: false }
    );

    previousTrack$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(PlayerActions.previousTrack),
                tap(() => this.spotifyPlayerService.previousTrack())
            ),
        { dispatch: false }
    );

    seek$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(PlayerActions.seek),
                tap(({ position }) => this.spotifyPlayerService.seek(position))
            ),
        { dispatch: false }
    );

    setVolume$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(PlayerActions.setVolume),
                tap(({ volume }) => this.spotifyPlayerService.setVolume(volume / 100))
            ),
        { dispatch: false }
    );

    disconnect$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(PlayerActions.disconnect),
                tap(() => this.spotifyPlayerService.disconnect())
            ),
        { dispatch: false }
    );
}
