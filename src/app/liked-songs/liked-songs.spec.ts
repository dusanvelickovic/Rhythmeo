import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LikedSongs } from './liked-songs';

describe('LikedSongs', () => {
  let component: LikedSongs;
  let fixture: ComponentFixture<LikedSongs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LikedSongs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LikedSongs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
