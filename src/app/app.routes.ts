import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Home } from './home/home';
import { Error } from './error/error';
import { AuthCallback } from './auth-callback/auth-callback';
import { authGuard } from './core/guards/auth.guard';
import { redirectIfAuthnenticated } from './core/guards/redirect-if-authnenticated.guard';
import { Profile } from './profile/profile';
import {LikedSongs} from './liked-songs/liked-songs';

export const routes: Routes = [
    // If no path is provided, redirect to /home
    // -> this will then redirect to /login if not authenticated
    { path: '', redirectTo: '/home', pathMatch: 'full' },

    // Login
    {
        path: 'login',
        component: Login,
        canActivate: [redirectIfAuthnenticated],
    },
    {
        path: 'login-callback',
        component: AuthCallback,
        canActivate: [redirectIfAuthnenticated]
    },

    // Protected routes
    { path: 'home', component: Home, canActivate: [authGuard] },
    { path: 'home2', component: Home, canActivate: [authGuard] },
    { path: 'profile', component: Profile, canActivate: [authGuard] },

    // Favorite songs
    { path: 'favorites', component: LikedSongs, canActivate: [authGuard] },

    // Error handling
    { path: 'auth/error', redirectTo: '/login', pathMatch: 'full' },
    { path: 'error', component: Error },
];
