import {
    ApplicationConfig,
    provideBrowserGlobalErrorListeners,
    provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { routes } from './app.routes';
import {authInterceptor} from './core/interceptors/auth.interceptor';
import { authReducer, AuthEffects } from './store/auth';
import { playerReducer, PlayerEffects } from './store/player';
import { likedSongsReducer, LikedSongsEffects } from './store/liked-songs';
import { spotifyReducer, SpotifyEffects } from './store/spotify';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideStore({ auth: authReducer, player: playerReducer, likedSongs: likedSongsReducer, spotify: spotifyReducer }),
        provideEffects([AuthEffects, PlayerEffects, LikedSongsEffects, SpotifyEffects]),
    ],
};
