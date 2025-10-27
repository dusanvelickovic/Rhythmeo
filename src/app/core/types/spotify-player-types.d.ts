interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: typeof Spotify;
}

declare namespace Spotify {
    interface Player {
        connect(): Promise<boolean>;
        disconnect(): void;
        addListener(event: string, callback: (data: any) => void): void;
        removeListener(event: string, callback?: (data: any) => void): void;
        getCurrentState(): Promise<PlaybackState | null>;
        setName(name: string): Promise<void>;
        getVolume(): Promise<number>;
        setVolume(volume: number): Promise<void>;
        pause(): Promise<void>;
        resume(): Promise<void>;
        togglePlay(): Promise<void>;
        seek(position_ms: number): Promise<void>;
        previousTrack(): Promise<void>;
        nextTrack(): Promise<void>;
        activateElement(): Promise<void>;
    }

    interface PlaybackState {
        context: {
            uri: string;
            metadata: any;
        };
        disallows: {
            pausing: boolean;
            skipping_prev: boolean;
        };
        paused: boolean;
        position: number;
        duration: number;
        track_window: {
            current_track: Track;
            previous_tracks: Track[];
            next_tracks: Track[];
        };
    }

    interface PlayerInit {
        name: string;
        getOAuthToken: (callback: (token: string) => void) => void;
        volume?: number;
    }

    interface Error {
        message: string;
    }

    const Player: {
        new (options: PlayerInit): Player;
    };
}
