import { Component } from '@angular/core';
import { LoginService, RedirectObject } from './login.service';

@Component({
    selector: 'app-login',
    imports: [],
    templateUrl: './login.html',
    styleUrl: './login.css',
})
export class Login {
    constructor(private loginService: LoginService) {}

    spotifyLoginUrl = 'http://api.rhythmeo.test:3000/auth/spotify'; // Nest.js backend route

    loginWithSpotify(): void {
        // Call login service to get the Spotify auth URL
        this.loginService.getSpotifyAuthUrl().subscribe({
            next: (data: RedirectObject): void => {
                this.redirectToSpotifyAuth(data.redirectUrl);
            },
            error: (error): void => {
                console.error('Error fetching Spotify auth URL:', error);
            },
        });
    }

    /**
     * Redirect the user to the Spotify authentication URL
     */
    redirectToSpotifyAuth(url: String): void {
        window.location.href = url as string;
    }
}
