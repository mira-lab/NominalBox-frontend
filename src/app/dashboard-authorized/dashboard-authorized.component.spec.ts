import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAuthorizedComponent } from './dashboard-authorized.component';

describe('DashboardAuthorizedComponent', () => {
  let component: DashboardAuthorizedComponent;
  let fixture: ComponentFixture<DashboardAuthorizedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardAuthorizedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardAuthorizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
