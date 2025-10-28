import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LikedTracks } from './liked-tracks';

describe('LikedTracks', () => {
  let component: LikedTracks;
  let fixture: ComponentFixture<LikedTracks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LikedTracks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LikedTracks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
