import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import * as SpotifyActions from './spotify.actions';
import { SpotifyService } from '../../core/services/spotify.service';

@Injectable()
export class SpotifyEffects {
    private actions$ = inject(Actions);
    private spotifyService = inject(SpotifyService);

    loadTopTracks$ = createEffect(() =>
        this.actions$.pipe(
            ofType(SpotifyActions.loadTopTracks),
            switchMap(() =>
                this.spotifyService.getUsersTopTracks().pipe(
                    map((response: any) => {
                        const source =
                            Array.isArray(response) ? response :
                            Array.isArray(response?.items) ? response.items :
                            Array.isArray(response?.tracks?.items) ? response.tracks.items :
                            [];

                        if (source.length === 0) {
                            console.warn('Unexpected top-tracks response shape', response);
                        }

                        const tracks = source.map((item: any) => ({ ...item }));
                        return SpotifyActions.loadTopTracksSuccess({ tracks });
                    }),
                    catchError((error) => {
                        console.error('Failed to fetch top tracks', error);
                        return of(SpotifyActions.loadTopTracksFailure({ error }));
                    })
                )
            )
        )
    );

    loadTracks$ = createEffect(() =>
        this.actions$.pipe(
            ofType(SpotifyActions.loadTracks),
            switchMap(({ trackIds }) =>
                this.spotifyService.getTracks(trackIds).pipe(
                    map((response: any) => {
                        const tracks = response?.tracks || [];
                        return SpotifyActions.loadTracksSuccess({ tracks });
                    }),
                    catchError((error) => {
                        console.error('Failed to fetch tracks', error);
                        return of(SpotifyActions.loadTracksFailure({ error }));
                    })
                )
            )
        )
    );
}
