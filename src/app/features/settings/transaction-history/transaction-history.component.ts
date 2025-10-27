import { Component, inject, OnInit } from '@angular/core';
import { PwaHeaderComponent } from '../../../shared/components/pwa-header/pwa-header.component';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { selectUser } from '../../../state/user/user.selector';
import { selectOrderById } from '../../../state/order/orders.selector';
import { loadTransactionHistoryOrders } from '../../../state/order/orders.actions';
import { take } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { OrderItemComponent } from '../../../shared/components/order-item/order-item.component';

@Component({
  selector: 'app-transaction-history',
  imports: [PwaHeaderComponent, AsyncPipe, OrderItemComponent],
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.scss',
})
export class TransactionHistoryComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);
  user$ = this.store.select(selectUser);
  userId: number | null = null;
  orderList$ = this.store.select(selectOrderById);

  ngOnInit(): void {
    this.user$.pipe(take(1)).subscribe((user) => {
      if (user) {
        this.userId = user.id;
        this.store.dispatch(loadTransactionHistoryOrders({ customerId: this.userId }));
      }
    });
  }

  handleOrderClick(orderId: number) {
    this.router.navigate(['transaction-details', orderId]);
  }
}
