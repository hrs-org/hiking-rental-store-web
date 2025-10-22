import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { OrderItemComponent } from '../../shared/components/order-item/order-item.component';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { loadBookingPageOrders } from '../../state/order/orders.actions';
import { selectBookingPageOrderList } from '../../state/order/orders.selector';
import { AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-booking',
  imports: [OrderItemComponent, AsyncPipe, MatIconModule],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  orderList$ = this.store.select(selectBookingPageOrderList);

  ngOnInit(): void {
    this.store.dispatch(loadBookingPageOrders());
  }

  handleOrderClick(orderId: string) {
    this.router.navigate(['booking', orderId]);
  }
}
