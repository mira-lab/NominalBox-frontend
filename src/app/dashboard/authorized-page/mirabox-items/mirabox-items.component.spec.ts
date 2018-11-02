import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiraboxItemsComponent } from './mirabox-items.component';

describe('MiraboxItemsComponent', () => {
  let component: MiraboxItemsComponent;
  let fixture: ComponentFixture<MiraboxItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiraboxItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiraboxItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
