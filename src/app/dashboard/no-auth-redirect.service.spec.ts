import { TestBed, inject } from '@angular/core/testing';

import { NoAuthRedirectService } from './no-auth-redirect.service';

describe('NoAuthRedirectService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NoAuthRedirectService]
    });
  });

  it('should be created', inject([NoAuthRedirectService], (service: NoAuthRedirectService) => {
    expect(service).toBeTruthy();
  }));
});
