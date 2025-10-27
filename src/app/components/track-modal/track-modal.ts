import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Track } from '../../core/types/track';
import { SpotifyPlayer } from '../spotify-player/spotify-player';

@Component({
  selector: 'app-track-modal',
    imports: [
        SpotifyPlayer
    ],
  templateUrl: './track-modal.html',
  styleUrl: './track-modal.css'
})
export class TrackModal {
    @Input() track: Track|null = null;
    @Input() nextTracks: Array<Track|null> = [];
    @Output() modalClosed: EventEmitter<string> = new EventEmitter<string>();

    closeModal() {
        this.modalClosed.emit();
    }
}
