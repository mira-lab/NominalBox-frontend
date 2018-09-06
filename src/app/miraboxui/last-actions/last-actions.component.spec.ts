import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastActionsComponent } from './last-actions.component';

describe('LastActionsComponent', () => {
  let component: LastActionsComponent;
  let fixture: ComponentFixture<LastActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
