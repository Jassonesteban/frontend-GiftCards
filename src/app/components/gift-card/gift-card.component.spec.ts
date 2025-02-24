import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftCardComponent } from './gift-card.component';

describe('GiftCardComponent', () => {
  let component: GiftCardComponent;
  let fixture: ComponentFixture<GiftCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GiftCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GiftCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
