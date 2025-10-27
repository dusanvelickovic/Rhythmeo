import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../types/user';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:3000';
    private currentUserSubject: BehaviorSubject<User | null>;
    public currentUser$: Observable<User | null>;

    constructor(
        private http: HttpClient,
        private router: Router,
    ) {
        const storedUser = localStorage.getItem('spotifyUser');
        this.currentUserSubject = new BehaviorSubject<User | null>(
            storedUser ? JSON.parse(storedUser) : null
        );
        this.currentUser$ = this.currentUserSubject.asObservable();
    }

    /**
     * Initiates the Spotify login process by redirecting to the backend auth endpoint.
     */
    loginWithSpotify() {
        window.location.href = `${this.apiUrl}/auth/spotify`;
    }

    /**
     * Handles the login callback by storing the token and fetching the user profile.
     */
    handleLoginCallback(token: string): Observable<User> {
        localStorage.setItem('access_token', token);

        return this.http.get<User>(`${this.apiUrl}/auth/profile`).pipe(
            tap(user => {
                localStorage.setItem('spotifyUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
            })
        );
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
        localStorage.removeItem('access_token');
        localStorage.removeItem('spotifyUser');
        this.currentUserSubject.next(null);

        this.router.navigate(['/login']);
    }
}
