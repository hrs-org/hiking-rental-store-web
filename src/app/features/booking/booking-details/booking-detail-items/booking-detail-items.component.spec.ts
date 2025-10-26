import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingDetailItemsComponent } from './booking-detail-items.component';

describe('BookingDetailItemsComponent', () => {
  let component: BookingDetailItemsComponent;
  let fixture: ComponentFixture<BookingDetailItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingDetailItemsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingDetailItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
