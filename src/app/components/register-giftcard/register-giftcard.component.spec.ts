import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterGiftcardComponent } from './register-giftcard.component';

describe('RegisterGiftcardComponent', () => {
  let component: RegisterGiftcardComponent;
  let fixture: ComponentFixture<RegisterGiftcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterGiftcardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterGiftcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
