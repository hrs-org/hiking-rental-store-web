import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentReturnpageComponent } from './payment-returnpage.component';

describe('PaymentReturnpageComponent', () => {
  let component: PaymentReturnpageComponent;
  let fixture: ComponentFixture<PaymentReturnpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentReturnpageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentReturnpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
