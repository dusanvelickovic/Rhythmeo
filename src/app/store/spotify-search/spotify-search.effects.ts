import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import * as SpotifySearchActions from './spotify-search.actions';
import { SpotifySearchService } from '../../core/services/spotify-search.service';

@Injectable()
export class SpotifySearchEffects {
    private actions$ = inject(Actions);
    private spotifySearchService = inject(SpotifySearchService);

    searchSpotify$ = createEffect(() =>
        this.actions$.pipe(
            ofType(SpotifySearchActions.searchSpotify),
            switchMap(({ query, searchType }) =>
                this.spotifySearchService.search(query, searchType).pipe(
                    map((tracks) => SpotifySearchActions.searchSpotifySuccess({ tracks })),
                    catchError((error) =>
                        of(SpotifySearchActions.searchSpotifyFailure({ error: error.message }))
                    )
                )
            )
        )
    );
}
