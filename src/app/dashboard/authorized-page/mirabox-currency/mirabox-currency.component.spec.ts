import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiraboxCurrencyComponent } from './mirabox-currency.component';

describe('MiraboxCurrencyComponent', () => {
  let component: MiraboxCurrencyComponent;
  let fixture: ComponentFixture<MiraboxCurrencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiraboxCurrencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiraboxCurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
