// file: `src/app/home/home.ts`
import { CommonModule } from '@angular/common';
import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, signal, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Track } from '../core/types/track';
import { TrackModal } from '../components/track-modal/track-modal';
import { Store } from '@ngrx/store';
import * as PlayerActions from '../store/player/player.actions';
import * as SpotifyActions from '../store/spotify/spotify.actions';
import * as SpotifySelectors from '../store/spotify/spotify.selectors';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, TrackModal],
    templateUrl: './home.html',
    styleUrls: ['./home.css'],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Home implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('swiperContainer', { read: ElementRef }) swiperContainer?: ElementRef;

    private destroy$ = new Subject<void>();
    tracks = signal<Track[]>([]);
    isLoading = signal(false);
    isTrackModalOpen = signal(false);

    // Tracks
    selectedTrack = signal<Track | null>(null);
    nextTrack = signal<Track | null>(null);
    previousTrack = signal<Track | null>(null);
    currentTrackIndex = 0;
    initialTrackIndex = 0; // Store the initial track index when modal opens

    constructor(
        private readonly store: Store,
    ) {}

    ngOnInit() {
        this.store.dispatch(SpotifyActions.loadTopTracks());

        this.store.select(SpotifySelectors.selectTopTracks)
            .pipe(takeUntil(this.destroy$))
            .subscribe(tracks => {
                this.tracks.set(tracks);
            });

        this.store.select(SpotifySelectors.selectTopTracksLoading)
            .pipe(takeUntil(this.destroy$))
            .subscribe(loading => {
                this.isLoading.set(loading);
            });
    }

    ngAfterViewInit() {
        // Initialize swiper after view is ready
        setTimeout(() => {
            const swiperEl = this.getSwiperElement();
            if (swiperEl?.swiper) {
                console.log('Swiper initialized');
                console.log('Swiper params:', swiperEl.swiper.params);
                console.log('Loop enabled:', swiperEl.swiper.params.loop);

                // Initialize swiper properly
                swiperEl.swiper.update();
            }
        }, 100);
    }

    private getSwiperElement() {
        return this.swiperContainer?.nativeElement || document.querySelector('swiper-container');
    }

    /**
     * Open the track modal for the selected track
     */
    openTrackModal(track: Track) {
        this.selectedTrack.set(track);

        // Store the initial track index and reset currentTrackIndex to 0
        this.initialTrackIndex = this.tracks().findIndex(t => t.id === track.id);
        this.currentTrackIndex = 0;

        this.updateNextAndPreviousTracks(this.initialTrackIndex);

        // Just open the modal immediately without any swiper sliding
        this.isTrackModalOpen.set(true);
    }

    /**
     * Handle request to move to the next track
     */
    onNextTrackRequested() {
        // Increment relative to modal (starts from 0)
        this.currentTrackIndex++;
        
        // Get actual index in tracks array (with wrap around for infinite scroll)
        const actualIndex = this.getActualIndexInTracksArray();
        
        console.log('Next - currentTrackIndex:', this.currentTrackIndex);
        console.log('Next - actualIndex:', actualIndex);
        
        this.selectedTrack.set(this.tracks()[actualIndex]);
        this.updateNextAndPreviousTracks(actualIndex);

        // Slide swiper
        setTimeout(() => {
            const swiperEl = this.getSwiperElement();
            if (swiperEl?.swiper) {
                console.log('Next - realIndex before:', swiperEl.swiper.realIndex);
                console.log('Next - activeIndex before:', swiperEl.swiper.activeIndex);
                
                // Force enable sliding
                swiperEl.swiper.allowSlideNext = true;
                swiperEl.swiper.allowSlidePrev = true;
                
                // Update swiper if needed
                swiperEl.swiper.update();

                const result = swiperEl.swiper.slideNext();
                console.log('slideNext result:', result);
                
                setTimeout(() => {
                    console.log('Next - realIndex after:', swiperEl.swiper.realIndex);
                    console.log('Next - activeIndex after:', swiperEl.swiper.activeIndex);
                }, 100);
            }
        }, 50);
    }

    /**
     * Handle request to move to the previous track
     */
    onPreviousTrackRequested() {
        // Now decrement
        this.currentTrackIndex--;

        const actualIndex = this.getActualIndexInTracksArray();
        this.selectedTrack.set(this.tracks()[actualIndex]);
        this.updateNextAndPreviousTracks(actualIndex);

        // Slide swiper
        setTimeout(() => {
            const swiperEl = this.getSwiperElement();
            if (swiperEl?.swiper) {
                // Force enable sliding
                swiperEl.swiper.allowSlideNext = true;
                swiperEl.swiper.allowSlidePrev = true;

                swiperEl.swiper.slidePrev();
            }
        }, 100);
    }

    /**
     * Get the actual index in tracks array based on currentTrackIndex offset
     */
    private getActualIndexInTracksArray(): number {
        const tracksLength = this.tracks().length; if (tracksLength === 0) return 0;

        const rawIndex = this.initialTrackIndex + this.currentTrackIndex;
        return ((rawIndex % tracksLength) + tracksLength) % tracksLength;
    }

    /**
     * Update the next and previous tracks based on the actual track index
     */
    private updateNextAndPreviousTracks(actualIndex: number) {
        const tracksLength = this.tracks().length;

        // Update next track with loop
        const nextIndex = (actualIndex + 1) % tracksLength;
        this.nextTrack.set(this.tracks()[nextIndex]);

        // Update previous track with loop
        const prevIndex = (actualIndex - 1 + tracksLength) % tracksLength;
        this.previousTrack.set(this.tracks()[prevIndex]);
    }

    closeTrackModal() {
        this.store.dispatch(PlayerActions.pause());

        this.isTrackModalOpen.set(false);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
