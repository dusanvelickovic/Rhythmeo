import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { User } from '../types/user';
import * as AuthActions from '../../store/auth/auth.actions';
import * as AuthSelectors from '../../store/auth/auth.selectors';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = environment.apiUrl;
    public currentUser$: Observable<User | null>;
    public isAuthenticated$: Observable<boolean>;

    constructor(
        private http: HttpClient,
        private store: Store,
    ) {
        this.currentUser$ = this.store.select(AuthSelectors.selectCurrentUser);
        this.isAuthenticated$ = this.store.select(AuthSelectors.selectIsAuthenticated);
        
        this.store.dispatch(AuthActions.checkAuthentication());
    }

    /**
     * Initiates the Spotify login process by redirecting to the backend auth endpoint.
     */
    loginWithSpotify() {
        this.store.dispatch(AuthActions.loginWithSpotify());
    }

    /**
     * Handles the login callback by storing the token and fetching the user profile.
     */
    handleLoginCallback(token: string): void {
        this.store.dispatch(AuthActions.handleLoginCallback({ token }));
    }

    /**
     * Retrieves the stored JWT token from local storage.
     */
    getJwtToken(): string | null {
        return localStorage.getItem('access_token');
    }

    /**
     * Retrieves the Spotify access token from the backend.
     */
    async getSpotifyAccessToken(): Promise<string | null> {
        try {
            const response: {accessToken: string} = await firstValueFrom(
                this.http.get<{ accessToken: string }>(`${this.apiUrl}/auth/spotify/token`)
            );
            return response?.accessToken ?? null;
        } catch (err) {
            return null;
        }
    }

    isAuthenticated(): boolean {
        return !!this.getJwtToken();
    }

    /**
     * Logs out the current user by clearing stored data and redirecting to login.
     */
    logout() {
        this.store.dispatch(AuthActions.logout());
    }
}
