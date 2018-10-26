import { TestBed, inject } from '@angular/core/testing';

import { PopUpSaveBoxService } from './pop-up-save-box.service';

describe('PopUpSaveBoxService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PopUpSaveBoxService]
    });
  });

  it('should be created', inject([PopUpSaveBoxService], (service: PopUpSaveBoxService) => {
    expect(service).toBeTruthy();
  }));
});
