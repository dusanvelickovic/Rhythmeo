import {Component} from '@angular/core';
import {User} from '../core/types/user';
import {RouterLink} from '@angular/router';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import * as AuthSelectors from '../store/auth/auth.selectors';
import {AsyncPipe} from '@angular/common';
import {ExtractUrlPipe} from '../core/pipes/extract-url.pipe';
import {logout} from '../store/auth';

@Component({
  selector: 'app-profile',
    imports: [
        RouterLink,
        AsyncPipe,
        ExtractUrlPipe
    ],
  templateUrl: './profile.html',
})
export class Profile{
    user$: Observable<User | null>;
    loading$: Observable<boolean>;
    error$: Observable<any>;

    constructor(
        private store: Store
    ) {
        this.user$ = this.store.select(AuthSelectors.selectCurrentUser);
        this.loading$ = this.store.select(AuthSelectors.selectAuthLoading);
        this.error$ = this.store.select(AuthSelectors.selectAuthError);
    }

    /**
     * Log out the current user
     */
    logout(): void {
        this.store.dispatch(logout())
    }
}
