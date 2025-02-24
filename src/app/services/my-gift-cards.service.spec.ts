import { TestBed } from '@angular/core/testing';

import { MyGiftCardsService } from './my-gift-cards.service';

describe('MyGiftCardsService', () => {
  let service: MyGiftCardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyGiftCardsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
