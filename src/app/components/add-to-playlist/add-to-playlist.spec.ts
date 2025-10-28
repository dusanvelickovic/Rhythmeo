import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddToPlaylist } from './add-to-playlist';

describe('AddToPlaylist', () => {
  let component: AddToPlaylist;
  let fixture: ComponentFixture<AddToPlaylist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddToPlaylist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddToPlaylist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
