import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface RedirectObject {
    redirectUrl: string;
}

@Injectable({
    providedIn: 'root',
})
export class LoginService {
    private apiUrl = environment.apiUrl;

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
