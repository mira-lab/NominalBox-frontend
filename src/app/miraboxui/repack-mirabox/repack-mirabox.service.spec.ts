import { TestBed, inject } from '@angular/core/testing';

import { RepackMiraboxService } from './repack-mirabox.service';

describe('RepackMiraboxService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RepackMiraboxService]
    });
  });

  it('should be created', inject([RepackMiraboxService], (service: RepackMiraboxService) => {
    expect(service).toBeTruthy();
  }));
});
