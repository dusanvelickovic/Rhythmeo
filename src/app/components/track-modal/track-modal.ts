import {Component, Output, signal, EventEmitter, Input, OnInit} from '@angular/core';
import {Track} from '../../core/types/track';

@Component({
  selector: 'app-track-modal',
  imports: [],
  templateUrl: './track-modal.html',
  styleUrl: './track-modal.css'
})
export class TrackModal {
    @Input() track: Track|null = null;
    @Output() modalClosed: EventEmitter<string> = new EventEmitter<string>();

    isPlaying = signal(false);

    // Toggle play/pause on vinyl click
    togglePlay() {
        if (!this.track) return;

        // this.isPlaying.update((playing) => !playing);
    }

    closeModal() {
        this.modalClosed.emit();
    }
}
