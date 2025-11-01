import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Playlist } from '../../store/playlist/playlist.state';
import { environment } from '../../../environments/environment';

export interface CreatePlaylistDto {
    name: string;
}

@Injectable({
    providedIn: 'root'
})
export class PlaylistService {
    private apiUrl = `${environment.apiUrl}/playlists`;

    constructor(private http: HttpClient) {}

    /**
     * Get all playlists for the current user
     */
    getUserPlaylists(): Observable<Playlist[]> {
        return this.http.get<Playlist[]>(this.apiUrl);
    }

    /**
     * Create a new playlist
     */
    createPlaylist(playlistData: CreatePlaylistDto): Observable<Playlist> {
        return this.http.post<Playlist>(this.apiUrl, playlistData);
    }

    /**
     * Add a track to a playlist
     */
    addTrackToPlaylist(playlistId: number, trackId: string): Observable<{ success: boolean }> {
        return this.http.post<{ success: boolean }>(`${this.apiUrl}/${playlistId}/tracks`, { trackId });
    }

    /**
     * Delete a playlist
     */
    deletePlaylist(playlistId: number): Observable<{ success: boolean }> {
        return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${playlistId}`);
    }

    /**
     * Update a playlist
     */
    updatePlaylist(playlistId: number, updates: Partial<Playlist>): Observable<Playlist> {
        return this.http.patch<Playlist>(`${this.apiUrl}/${playlistId}`, updates);
    }

    /**
     * Get a specific playlist by ID
     */
    getPlaylistById(playlistId: number): Observable<Playlist> {
        return this.http.get<Playlist>(`${this.apiUrl}/${playlistId}`);
    }

    /**
     * Remove a track from a playlist
     */
    removeTrackFromPlaylist(playlistId: number, trackId: string): Observable<{ success: boolean }> {
        return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${playlistId}/tracks/${trackId}`);
    }
}
