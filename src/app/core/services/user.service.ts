import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {User} from '../types/user';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    /**
     * Fetches the current authenticated user's profile.
     */
    getCurrentUser(): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/users/me`);
    }
}
