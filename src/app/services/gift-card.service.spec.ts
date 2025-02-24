import { TestBed } from '@angular/core/testing';

import { GiftCardService } from './gift-card.service';

describe('GiftCardService', () => {
  let service: GiftCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GiftCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
