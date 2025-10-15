import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { spotifyGuard } from './spotify-guard';

describe('spotifyGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => spotifyGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
