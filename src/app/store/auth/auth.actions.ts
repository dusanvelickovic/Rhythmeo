import { createAction, props } from '@ngrx/store';
import { User } from '../../core/types/user';

export const loginWithSpotify = createAction('[Auth] Login With Spotify');

export const handleLoginCallback = createAction(
    '[Auth] Handle Login Callback',
    props<{ token: string }>()
);

export const loadUserProfileSuccess = createAction(
    '[Auth] Load User Profile Success',
    props<{ user: User }>()
);

export const loadUserProfileFailure = createAction(
    '[Auth] Load User Profile Failure',
    props<{ error: any }>()
);

export const logout = createAction('[Auth] Logout');

export const checkAuthentication = createAction('[Auth] Check Authentication');
