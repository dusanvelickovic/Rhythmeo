export interface Track {
    id: string;
    name: string;
    uri: string;
    href: string;
    explicit: boolean;
    is_playable: boolean;
    track_number: number;
    duration_ms: number;
    popularity: number;
    artists: Array<{
        id: string;
        name: string;
        href: string;
        uri: string;
    }>;
    album: {
        id: string;
        name: string;
        total_tracks: number;
        uri: string;
        href: string;
        release_date: string;
        artists: Array<{
            id: string;
            name: string;
            href: string;
            uri: string;
        }>;
        images: Array<{
            url: string;
            height: number;
            width: number;
        }>;
    };
    external_urls: {
        spotify: string;
    };
}
