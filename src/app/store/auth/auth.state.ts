import { User } from '../../core/types/user';

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: any;
}

export const initialAuthState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};
