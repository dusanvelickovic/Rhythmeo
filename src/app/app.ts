import {Component, OnDestroy, OnInit } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Navigation} from './components/navigation/navigation';
import {AuthService} from './core/services/auth.service';
import {SpotifyPlayerService} from './core/services/spotify-player.service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, Navigation],
    templateUrl: './app.html',
    styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy{
    constructor(
        public authService: AuthService,
        private readonly spotifyPlayerService: SpotifyPlayerService,
    ) {}

    ngOnInit() {
        window.onSpotifyWebPlaybackSDKReady = () => {
            console.log('Spotify Web Playback SDK is ready');
            this.initializePlayer();
        }
    }

    /**
     * Initialize Spotify Player
     */
    async initializePlayer(): Promise<void> {
        try {
            await this.spotifyPlayerService.initializePlayer();
        } catch (error) {
            console.error('Failed to initialize player:', error);
        }
    }

    /**
     * Clean up Spotify Player on component destroy
     */
    ngOnDestroy(): void {
        this.spotifyPlayerService.disconnect();
    }
}
