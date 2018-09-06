import { TestBed, inject } from '@angular/core/testing';

import { LastActionsService } from './last-actions.service';

describe('LastActionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LastActionsService]
    });
  });

  it('should be created', inject([LastActionsService], (service: LastActionsService) => {
    expect(service).toBeTruthy();
  }));
});
