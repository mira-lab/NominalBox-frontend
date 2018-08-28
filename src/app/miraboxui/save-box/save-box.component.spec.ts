import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveBoxComponent } from './save-box.component';

describe('SaveBoxComponent', () => {
  let component: SaveBoxComponent;
  let fixture: ComponentFixture<SaveBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
