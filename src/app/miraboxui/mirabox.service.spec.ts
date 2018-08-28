import { TestBed, inject } from '@angular/core/testing';

import { MiraboxService } from './mirabox.service';

describe('MiraboxService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MiraboxService]
    });
  });

  it('should be created', inject([MiraboxService], (service: MiraboxService) => {
    expect(service).toBeTruthy();
  }));
});
