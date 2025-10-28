import { LikedSong } from '../../core/services/liked-songs.service';

export interface LikedSongsState {
    likedSongs: LikedSong[];
    likedTrackIds: Set<string>;
    loading: boolean;
    error: any;
}

export const initialLikedSongsState: LikedSongsState = {
    likedSongs: [],
    likedTrackIds: new Set<string>(),
    loading: false,
    error: null,
};
