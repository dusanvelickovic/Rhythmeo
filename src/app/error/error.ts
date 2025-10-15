import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-error',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './error.html',
})
export class Error implements OnInit {
    errorMessage: string = 'An error occurred';
    errorDetails: string = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
    ) {}

    ngOnInit(): void {
        // Get error message from query parameters
        this.route.queryParams.subscribe((params) => {
            if (params['message']) {
                this.errorMessage = params['message'];
            }
            if (params['details']) {
                this.errorDetails = params['details'];
            }
        });
    }

    goToLogin(): void {
        this.router.navigate(['/login']);
    }

    goToHome(): void {
        this.router.navigate(['/home']);
    }
}
