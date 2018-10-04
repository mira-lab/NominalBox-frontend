import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepackMiraboxComponent } from './repack-mirabox.component';

describe('RepackMiraboxComponent', () => {
  let component: RepackMiraboxComponent;
  let fixture: ComponentFixture<RepackMiraboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepackMiraboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepackMiraboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
