import { createReducer, on } from '@ngrx/store';
import { AuthState, initialAuthState } from './auth.state';
import * as AuthActions from './auth.actions';

export const authReducer = createReducer(
    initialAuthState,
    on(AuthActions.handleLoginCallback, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),
    on(AuthActions.loadUserProfileSuccess, (state, { user }) => ({
        ...state,
        user,
        isAuthenticated: true,
        loading: false,
        error: null,
    })),
    on(AuthActions.loadUserProfileFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),
    on(AuthActions.logout, () => initialAuthState),
    on(AuthActions.checkAuthentication, (state) => {
        const token = localStorage.getItem('access_token');
        const storedUser = localStorage.getItem('spotifyUser');
        
        if (token && storedUser) {
            return {
                ...state,
                token,
                user: JSON.parse(storedUser),
                isAuthenticated: true,
            };
        }
        
        return state;
    })
);
