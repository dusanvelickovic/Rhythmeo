import { Track } from '../../core/types/track';

export interface SpotifySearchState {
    searchResults: Track[];
    searchLoading: boolean;
    searchError: any;
    searchQuery: string | null;
}

export const initialSpotifySearchState: SpotifySearchState = {
    searchResults: [],
    searchLoading: false,
    searchError: null,
    searchQuery: null,
};
