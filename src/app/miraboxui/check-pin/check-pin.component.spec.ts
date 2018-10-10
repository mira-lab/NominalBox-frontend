import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AskPinComponent } from './check-pin.component';

describe('AskPinComponent', () => {
  let component: AskPinComponent;
  let fixture: ComponentFixture<AskPinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AskPinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AskPinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
