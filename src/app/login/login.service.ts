import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RedirectObject {
    redirectUrl: string;
}

@Injectable({
    providedIn: 'root',
})
export class LoginService {
    private apiUrl = 'http://api.rhythmeo.test:3000';

    constructor(private http: HttpClient) {}

    getSpotifyAuthUrl() {
        return this.http.get<RedirectObject>(`${this.apiUrl}/auth/spotify`);
    }

    /**
     * Check if the user is authenticated with Spotify
     */
    checkSpotifyToken(): Observable<{ valid: boolean }> {
        return this.http.get<{ valid: boolean }>(`${this.apiUrl}/auth/spotify/check`, { withCredentials: true });
    }
}
