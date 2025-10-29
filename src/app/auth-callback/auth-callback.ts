import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs/operators';
import * as AuthSelectors from '../store/auth/auth.selectors';
import * as AuthActions from '../store/auth/auth.actions';

@Component({
    selector: 'app-auth-callback',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="callback-container">
      <div class="spinner"></div>
      <p>Prijavljivanje...</p>
    </div>
  `,
    styles: [`
    .callback-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: #191414;
      color: white;
    }
    .spinner {
      border: 4px solid rgba(255,255,255,0.1);
      border-left-color: #1DB954;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class AuthCallback implements OnInit {
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private store: Store
    ) {}

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            const token = params['token'];

            if (token) {
                this.store.dispatch(AuthActions.handleLoginCallback({ token }));

                this.store.select(AuthSelectors.selectAuthLoading).pipe(
                    filter(loading => !loading),
                    take(1)
                ).subscribe(() => {
                    this.store.select(AuthSelectors.selectIsAuthenticated).pipe(
                        take(1)
                    ).subscribe(isAuthenticated => {
                        if (isAuthenticated) {
                            this.router.navigate(['/home']);
                        } else {
                            this.router.navigate(['/error']);
                        }
                    });
                });
            } else {
                this.router.navigate(['/login']);
            }
        });
    }
}
