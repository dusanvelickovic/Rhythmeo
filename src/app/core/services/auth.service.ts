import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
// import { SpotifyUser } from '../models/user.model';

export interface User {
    id: string;
    spotifyId: string;
    displayName: string;
    email: string;
    profileImage?: string;
    country?: string;
}

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

    getToken(): string | null {
        return localStorage.getItem('access_token');
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }
}
