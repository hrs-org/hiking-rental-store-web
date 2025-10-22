import { Component, inject, OnInit } from '@angular/core';
import { OrderItemComponent } from '../../shared/components/order-item/order-item.component';
import { Store } from '@ngrx/store';
import { selectReturnPageOrderList } from '../../state/order/orders.selector';
import { loadReturnPageOrders } from '../../state/order/orders.actions';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-return',
  imports: [OrderItemComponent, AsyncPipe],
  templateUrl: './return.component.html',
  styleUrl: './return.component.scss',
})
export class ReturnComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  orderList$ = this.store.select(selectReturnPageOrderList);

  ngOnInit(): void {
    this.store.dispatch(loadReturnPageOrders());
  }

  handleOrderClick(orderId: string) {
    this.router.navigate(['return', orderId]);
  }
}
