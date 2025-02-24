import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyGiftcardsComponent } from './my-giftcards.component';

describe('MyGiftcardsComponent', () => {
  let component: MyGiftcardsComponent;
  let fixture: ComponentFixture<MyGiftcardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyGiftcardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyGiftcardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
