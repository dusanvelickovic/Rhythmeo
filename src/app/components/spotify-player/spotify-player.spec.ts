import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotifyPlayer } from './spotify-player';

describe('SpotifyPlayer', () => {
  let component: SpotifyPlayer;
  let fixture: ComponentFixture<SpotifyPlayer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpotifyPlayer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpotifyPlayer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
