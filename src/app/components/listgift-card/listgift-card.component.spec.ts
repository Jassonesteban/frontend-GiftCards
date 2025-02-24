import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListgiftCardComponent } from './listgift-card.component';

describe('ListgiftCardComponent', () => {
  let component: ListgiftCardComponent;
  let fixture: ComponentFixture<ListgiftCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListgiftCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListgiftCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
