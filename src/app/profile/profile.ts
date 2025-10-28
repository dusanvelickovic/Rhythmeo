import {Component, OnInit} from '@angular/core';
import {User} from '../core/types/user';
import {AuthService} from '../core/services/auth.service';
import {RouterLink} from '@angular/router';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import * as AuthSelectors from '../store/auth/auth.selectors';
import {AsyncPipe} from '@angular/common';
import {ExtractUrlPipe} from '../core/pipes/extract-url.pipe';

@Component({
  selector: 'app-profile',
    imports: [
        RouterLink,
        AsyncPipe,
        ExtractUrlPipe
    ],
  templateUrl: './profile.html',
})
export class Profile implements OnInit{
    user$: Observable<User | null>;
    loading$: Observable<boolean>;
    error$: Observable<any>;

    constructor(
        private authService: AuthService,
        private store: Store
    ) {
        this.user$ = this.store.select(AuthSelectors.selectCurrentUser);
        this.loading$ = this.store.select(AuthSelectors.selectAuthLoading);
        this.error$ = this.store.select(AuthSelectors.selectAuthError);
    }

    ngOnInit() {
    }

    /**
     * Log out the current user
     */
    logout(): void {
        this.authService.logout();
    }
}
