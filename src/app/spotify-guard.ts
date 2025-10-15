import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import {LoginService} from './login/login.service';
import {map, catchError} from 'rxjs/operators';
import {of} from 'rxjs';

export const spotifyGuard: CanActivateFn = (route, state) => {
    const loginService = inject(LoginService);
    const router = inject(Router);

    return loginService.checkSpotifyToken().pipe(
        map(response => {
            if (response.valid) {
                return true;
            }
            router.navigate(['/login']);
            return false;
        }),
        catchError(error => {
            // Handle errors (401, network issues, etc.)
            console.error('Token validation failed:', error);
            router.navigate(['/login']);
            return of(false);
        })
    );
};
