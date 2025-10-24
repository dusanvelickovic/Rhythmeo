import {Component, OnInit} from '@angular/core';
import {UserService} from '../core/services/user.service';
import {User} from '../core/types/user';
import {AuthService} from '../core/services/auth.service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-profile',
    imports: [
        RouterLink
    ],
  templateUrl: './profile.html',
})
export class Profile implements OnInit{
    user: User | null = null;
    loading = true;
    error: string | null = null;

    constructor(
        private userService: UserService,
        private authService: AuthService,
    ) {}

    ngOnInit() {
        this.loadUserProfile();
    }

    /**
     * Load the current user's profile information
     */
    loadUserProfile(): void {
        this.loading = true;
        this.error = null;

        this.userService.getCurrentUser().subscribe({
            next: (data) => {
                this.user = data;
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Failed to load user profile';
                this.loading = false;
                console.error('Error loading user:', err);
            }
        });
    }

    /**
     * Log out the current user
     */
    logout(): void {
        this.authService.logout();
    }
}
