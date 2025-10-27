import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LikeSongDto {
    trackId: string;
    trackName: string;
    artistName?: string;
    albumName?: string;
    imageUrl?: string;
}

export interface LikedSong {
    id: number;
    userId: string;
    trackId: string;
    trackName: string;
    artistName?: string;
    albumName?: string;
    imageUrl?: string;
    likedAt: Date;
}

@Injectable({
    providedIn: 'root'
})
export class LikedSongsService {
    private apiUrl = 'http://localhost:3000/liked-songs';

    constructor(private http: HttpClient) {}

    /**
     * Like a song
     */
    likeSong(songData: LikeSongDto): Observable<LikedSong> {
        return this.http.post<LikedSong>(this.apiUrl, songData);
    }

    /**
     * Unlike a song by its track ID
     */
    unlikeSong(trackId: string): Observable<{ success: boolean }> {
        return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${trackId}`);
    }

    /**
     * Get all liked songs for the current user
     */
    getUserLikedSongs(): Observable<LikedSong[]> {
        return this.http.get<LikedSong[]>(this.apiUrl);
    }

    /**
     * Check if a track is liked by the user
     */
    checkIfLiked(trackId: string): Observable<{ isLiked: boolean }> {
        return this.http.get<{ isLiked: boolean }>(`${this.apiUrl}/${trackId}/check`);
    }
}
