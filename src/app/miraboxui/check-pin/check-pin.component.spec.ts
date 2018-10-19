import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckPinComponent } from './check-pin.component';

describe('AskPinComponent', () => {
  let component: CheckPinComponent;
  let fixture: ComponentFixture<CheckPinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckPinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckPinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
