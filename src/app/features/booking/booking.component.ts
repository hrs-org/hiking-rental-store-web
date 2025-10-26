import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
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
  private orderService = inject(OrderService);

  orderList$ = this.store.select(selectBookingPageOrderList);

  ngOnInit(): void {
    this.store.dispatch(loadBookingPageOrders());
  }

  handleOrderClick(orderId: number) {
    this.router.navigate(['booking', orderId]);
  }

  deleteOrder(event: number | { id: number; auto?: boolean }) {
    let orderId: number;
    let auto = false;
    if (typeof event === 'object' && event !== null) {
      orderId = event.id;
      auto = !!event.auto;
    } else {
      orderId = event;
    }
    if (!auto) {
      if (!confirm('Are you sure you want to delete this order?')) return;
    }
    this.orderService.deleteOrder(orderId).subscribe({
      next: () => {
        this.store.dispatch(loadBookingPageOrders());
      },
      error: (err) => {
        alert('Delete failed: ' + (err?.error?.message || 'Unknown error'));
      },
    });
  }
}
