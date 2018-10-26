import { TestBed, inject } from '@angular/core/testing';

import { ServerCommunicationService } from './server-communication.service';

describe('ServerCommunicationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServerCommunicationService]
    });
  });

  it('should be created', inject([ServerCommunicationService], (service: ServerCommunicationService) => {
    expect(service).toBeTruthy();
  }));
});
