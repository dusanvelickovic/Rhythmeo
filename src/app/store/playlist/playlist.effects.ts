import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import * as PlaylistActions from './playlist.actions';
import { PlaylistService } from '../../core/services/playlist.service';

@Injectable()
export class PlaylistEffects {
    private actions$ = inject(Actions);
    private playlistService = inject(PlaylistService);

    loadPlaylists$ = createEffect(() =>
        this.actions$.pipe(
            ofType(PlaylistActions.loadPlaylists),
            switchMap(() =>
                this.playlistService.getUserPlaylists().pipe(
                    map((playlists) =>
                        PlaylistActions.loadPlaylistsSuccess({ playlists })
                    ),
                    catchError((error) =>
                        of(PlaylistActions.loadPlaylistsFailure({ error }))
                    )
                )
            )
        )
    );

    createPlaylist$ = createEffect(() =>
        this.actions$.pipe(
            ofType(PlaylistActions.createPlaylist),
            switchMap(({ playlistData }) =>
                this.playlistService.createPlaylist(playlistData).pipe(
                    map((playlist) =>
                        PlaylistActions.createPlaylistSuccess({ playlist })
                    ),
                    catchError((error) =>
                        of(PlaylistActions.createPlaylistFailure({ error }))
                    )
                )
            )
        )
    );

    addTrackToPlaylist$ = createEffect(() =>
        this.actions$.pipe(
            ofType(PlaylistActions.addTrackToPlaylist),
            switchMap(({ playlistId, trackId }) =>
                this.playlistService.addTrackToPlaylist(playlistId, trackId).pipe(
                    map(() =>
                        PlaylistActions.addTrackToPlaylistSuccess({ playlistId, trackId })
                    ),
                    catchError((error) =>
                        of(PlaylistActions.addTrackToPlaylistFailure({ error }))
                    )
                )
            )
        )
    );

    deletePlaylist$ = createEffect(() =>
        this.actions$.pipe(
            ofType(PlaylistActions.deletePlaylist),
            switchMap(({ playlistId }) =>
                this.playlistService.deletePlaylist(playlistId).pipe(
                    map(() =>
                        PlaylistActions.deletePlaylistSuccess({ playlistId })
                    ),
                    catchError((error) =>
                        of(PlaylistActions.deletePlaylistFailure({ error }))
                    )
                )
            )
        )
    );

    updatePlaylist$ = createEffect(() =>
        this.actions$.pipe(
            ofType(PlaylistActions.updatePlaylist),
            switchMap(({ playlistId, updates }) =>
                this.playlistService.updatePlaylist(playlistId, updates).pipe(
                    map((playlist) =>
                        PlaylistActions.updatePlaylistSuccess({ playlist })
                    ),
                    catchError((error) =>
                        of(PlaylistActions.updatePlaylistFailure({ error }))
                    )
                )
            )
        )
    );
}
