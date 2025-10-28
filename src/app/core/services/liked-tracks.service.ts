import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LikeTrackDto {
    trackId: string;
    trackName: string;
    artistName?: string;
    albumName?: string;
    imageUrl?: string;
}

export interface LikedTrack {
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
export class LikedTracksService {
    private apiUrl = 'http://localhost:3000/liked-tracks';

    constructor(private http: HttpClient) {}

    /**
     * Like a track
     */
    likeTrack(trackData: LikeTrackDto): Observable<LikedTrack> {
        return this.http.post<LikedTrack>(this.apiUrl, trackData);
    }

    /**
     * Unlike a track by its track ID
     */
    unlikeTrack(trackId: string): Observable<{ success: boolean }> {
        return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${trackId}`);
    }

    /**
     * Get all liked tracks for the current user
     */
    getUserLikedTracks(): Observable<LikedTrack[]> {
        return this.http.get<LikedTrack[]>(this.apiUrl);
    }

    /**
     * Check if a track is liked by the user
     */
    checkIfLiked(trackId: string): Observable<{ isLiked: boolean }> {
        return this.http.get<{ isLiked: boolean }>(`${this.apiUrl}/${trackId}/check`);
    }
}
