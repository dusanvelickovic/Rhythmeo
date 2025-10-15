import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Home } from './home/home';
import { Error } from './error/error';
import {spotifyGuard} from './spotify-guard';

export const routes: Routes = [
    { path: 'login', component: Login },
    { path: 'home', component: Home, canActivate: [spotifyGuard] },
    { path: 'error', component: Error },
    { path: '**', redirectTo: 'login', pathMatch: 'full' },
];
