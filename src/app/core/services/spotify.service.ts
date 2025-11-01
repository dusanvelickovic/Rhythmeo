import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SpotifyService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getUsersTopTracks(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/spotify/top-tracks`);
    }

    getTracks(trackIds: string[]): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/spotify/tracks`, { trackIds });
    }
}
