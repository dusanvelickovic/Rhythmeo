import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackModal } from './track-modal';

describe('TrackModal', () => {
  let component: TrackModal;
  let fixture: ComponentFixture<TrackModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
