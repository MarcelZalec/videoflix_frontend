import { TestBed } from '@angular/core/testing';

import { LittleHelpersService } from './little-helpers.service';

describe('LittleHelpersService', () => {
  let service: LittleHelpersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LittleHelpersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
