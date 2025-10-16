import { Component } from '@angular/core';
import {AuthService} from '../core/services/auth.service';

@Component({
    selector: 'app-login',
    imports: [],
    templateUrl: './login.html',
    styleUrl: './login.css',
})
export class Login {
    constructor(
        private authService: AuthService,
    ) {}

    loginWithSpotify() {
        this.authService.loginWithSpotify();
    }
}
