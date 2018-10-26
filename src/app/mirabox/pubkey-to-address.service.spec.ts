import { TestBed, inject } from '@angular/core/testing';

import { PubkeyToAddressService } from './pubkey-to-address.service';

describe('PubkeyToAddressService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PubkeyToAddressService]
    });
  });

  it('should be created', inject([PubkeyToAddressService], (service: PubkeyToAddressService) => {
    expect(service).toBeTruthy();
  }));
});
