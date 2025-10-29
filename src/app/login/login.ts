import {Component, inject} from '@angular/core';
import {AuthService} from '../core/services/auth.service';
import {Store} from '@ngrx/store';
import {loginWithSpotify} from '../store/auth';

@Component({
    selector: 'app-login',
    imports: [],
    templateUrl: './login.html',
    styleUrl: './login.css',
})
export class Login {
    private store = inject(Store);

    loginWithSpotify() {
        this.store.dispatch(loginWithSpotify())
    }
}
