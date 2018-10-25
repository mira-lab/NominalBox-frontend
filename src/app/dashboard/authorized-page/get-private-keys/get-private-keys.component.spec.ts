import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetPrivateKeysComponent } from './get-private-keys.component';

describe('GetPrivateKeysComponent', () => {
  let component: GetPrivateKeysComponent;
  let fixture: ComponentFixture<GetPrivateKeysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetPrivateKeysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetPrivateKeysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
