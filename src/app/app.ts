import {Component, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Navigation} from './components/navigation/navigation';
import {AuthService} from './core/services/auth.service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, Navigation],
    templateUrl: './app.html',
    styleUrl: './app.css',
})
export class App {
    protected readonly title = signal('rhythmeo');

    constructor(public authService: AuthService) {}
}
