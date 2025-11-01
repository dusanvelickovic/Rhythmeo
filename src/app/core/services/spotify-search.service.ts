import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Track } from '../types/track';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SpotifySearchService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    search(query: string, type: string = 'track'): Observable<Track[]> {
        return this.http.get<Track[]>(`${this.apiUrl}/spotify-search`, {
            params: { query, type }
        });
    }
}
