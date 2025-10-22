import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Order } from '../../../core/models/order/order';
import moment from 'moment';
import { CurrencyPipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-order-item',
  imports: [CurrencyPipe, NgClass],
  templateUrl: './order-item.component.html',
  styleUrl: './order-item.component.scss',
})
export class OrderItemComponent {
  @Input() order?: Order;
  @Output() orderClick = new EventEmitter<string>();

  formatDate(date?: Date) {
    if (!date) return '';
    return moment(date).format('MM/DD/YYYY');
  }

  onClick() {
    this.orderClick.emit(this.order?.id);
  }
}
