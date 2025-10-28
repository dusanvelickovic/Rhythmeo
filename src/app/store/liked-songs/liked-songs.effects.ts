import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import * as LikedSongsActions from './liked-songs.actions';
import { LikedSongsService } from '../../core/services/liked-songs.service';

@Injectable()
export class LikedSongsEffects {
    private actions$ = inject(Actions);
    private likedSongsService = inject(LikedSongsService);

    loadLikedSongs$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LikedSongsActions.loadLikedSongs),
            switchMap(() =>
                this.likedSongsService.getUserLikedSongs().pipe(
                    map((likedSongs) =>
                        LikedSongsActions.loadLikedSongsSuccess({ likedSongs })
                    ),
                    catchError((error) =>
                        of(LikedSongsActions.loadLikedSongsFailure({ error }))
                    )
                )
            )
        )
    );

    likeSong$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LikedSongsActions.likeSong),
            switchMap(({ songData }) =>
                this.likedSongsService.likeSong(songData).pipe(
                    map((likedSong) =>
                        LikedSongsActions.likeSongSuccess({ likedSong })
                    ),
                    catchError((error) =>
                        of(LikedSongsActions.likeSongFailure({ error }))
                    )
                )
            )
        )
    );

    unlikeSong$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LikedSongsActions.unlikeSong),
            switchMap(({ trackId }) =>
                this.likedSongsService.unlikeSong(trackId).pipe(
                    map(() =>
                        LikedSongsActions.unlikeSongSuccess({ trackId })
                    ),
                    catchError((error) =>
                        of(LikedSongsActions.unlikeSongFailure({ error }))
                    )
                )
            )
        )
    );

    checkIfLiked$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LikedSongsActions.checkIfLiked),
            switchMap(({ trackId }) =>
                this.likedSongsService.checkIfLiked(trackId).pipe(
                    map(({ isLiked }) =>
                        LikedSongsActions.checkIfLikedSuccess({ trackId, isLiked })
                    ),
                    catchError((error) =>
                        of(LikedSongsActions.checkIfLikedFailure({ error }))
                    )
                )
            )
        )
    );
}
