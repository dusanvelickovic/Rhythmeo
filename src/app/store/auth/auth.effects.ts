import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import * as AuthActions from './auth.actions';
import { User } from '../../core/types/user';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthEffects {
    private apiUrl = environment.apiUrl;
    private actions$ = inject(Actions);
    private http = inject(HttpClient);
    private router = inject(Router);

    loginWithSpotify$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(AuthActions.loginWithSpotify),
                tap(() => {
                    window.location.href = `${this.apiUrl}/auth/spotify`;
                })
            ),
        { dispatch: false }
    );

    handleLoginCallback$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.handleLoginCallback),
            tap(({ token }) => {
                localStorage.setItem('access_token', token);
            }),
            switchMap(() =>
                this.http.get<User>(`${this.apiUrl}/auth/profile`).pipe(
                    map((user) => {
                        localStorage.setItem('spotifyUser', JSON.stringify(user));
                        return AuthActions.loadUserProfileSuccess({ user });
                    }),
                    catchError((error) =>
                        of(AuthActions.loadUserProfileFailure({ error }))
                    )
                )
            )
        )
    );

    logout$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(AuthActions.logout),
                tap(() => {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('spotifyUser');
                    this.router.navigate(['/login']);
                })
            ),
        { dispatch: false }
    );
}
