import { TestBed, inject } from '@angular/core/testing';

import { MiraboxDataService } from './mirabox-data.service';

describe('MiraboxDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MiraboxDataService]
    });
  });

  it('should be created', inject([MiraboxDataService], (service: MiraboxDataService) => {
    expect(service).toBeTruthy();
  }));
});
