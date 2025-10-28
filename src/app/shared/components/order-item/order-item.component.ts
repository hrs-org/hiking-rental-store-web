import { Component, EventEmitter, Input, Output, ChangeDetectorRef, inject } from '@angular/core';
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
  @Input() showDelete = false;
  @Input() order?: Order;
  @Output() orderClick = new EventEmitter<number>();
  @Output() deleteClick = new EventEmitter<number>();
  private cdr = inject(ChangeDetectorRef);

  formatDate(date?: Date) {
    if (!date) return '';
    return moment(date).format('MM/DD/YYYY');
  }

  onClick() {
    this.orderClick.emit(this.order?.id);
  }

  onDeleteClick(event: MouseEvent) {
    event.stopPropagation();
    this.deleteClick.emit(this.order?.id);
  }
}
