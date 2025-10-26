import { Component, Input } from '@angular/core';
import { OrderItem } from '../../../../core/models/order/order';

@Component({
  selector: 'app-booking-detail-items',
  imports: [],
  templateUrl: './booking-detail-items.component.html',
  styleUrl: './booking-detail-items.component.scss',
})
export class BookingDetailItemsComponent {
  @Input() item: OrderItem = {} as OrderItem;
}
