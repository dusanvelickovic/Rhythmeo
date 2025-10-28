import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import * as LikedTracksActions from './liked-tracks.actions';
import { LikedTracksService } from '../../core/services/liked-tracks.service';

@Injectable()
export class LikedTracksEffects {
    private actions$ = inject(Actions);
    private likedTracksService = inject(LikedTracksService);

    loadLikedTracks$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LikedTracksActions.loadLikedTracks),
            switchMap(() =>
                this.likedTracksService.getUserLikedTracks().pipe(
                    map((likedTracks) =>
                        LikedTracksActions.loadLikedTracksSuccess({ likedTracks })
                    ),
                    catchError((error) =>
                        of(LikedTracksActions.loadLikedTracksFailure({ error }))
                    )
                )
            )
        )
    );

    likeTrack$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LikedTracksActions.likeTrack),
            switchMap(({ trackData }) =>
                this.likedTracksService.likeTrack(trackData).pipe(
                    map((likedTrack) =>
                        LikedTracksActions.likeTrackSuccess({ likedTrack })
                    ),
                    catchError((error) =>
                        of(LikedTracksActions.likeTrackFailure({ error }))
                    )
                )
            )
        )
    );

    unlikeTrack$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LikedTracksActions.unlikeTrack),
            switchMap(({ trackId }) =>
                this.likedTracksService.unlikeTrack(trackId).pipe(
                    map(() =>
                        LikedTracksActions.unlikeTrackSuccess({ trackId })
                    ),
                    catchError((error) =>
                        of(LikedTracksActions.unlikeTrackFailure({ error }))
                    )
                )
            )
        )
    );

    checkIfLiked$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LikedTracksActions.checkIfLiked),
            switchMap(({ trackId }) =>
                this.likedTracksService.checkIfLiked(trackId).pipe(
                    map(({ isLiked }) =>
                        LikedTracksActions.checkIfLikedSuccess({ trackId, isLiked })
                    ),
                    catchError((error) =>
                        of(LikedTracksActions.checkIfLikedFailure({ error }))
                    )
                )
            )
        )
    );
}
