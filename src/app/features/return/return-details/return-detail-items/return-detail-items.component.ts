import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrderItem, ReturnRentalOrderItem } from '../../../../core/models/order/order';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-return-detail-items',
  imports: [MatIconModule, MatButtonModule, NgClass],
  templateUrl: './return-detail-items.component.html',
  styleUrl: './return-detail-items.component.scss',
})
export class ReturnDetailItemsComponent {
  @Input() item: OrderItem = {} as OrderItem;
  @Input() returnQuantities: Record<string, ReturnRentalOrderItem> = {};
  @Input() selectedQty = {
    rentalOrderItemId: '',
    goodQty: 0,
    repairQty: 0,
    damagedQty: 0,
    lostQty: 0,
  } as ReturnRentalOrderItem;

  @Output() quantityChange = new EventEmitter<{
    orderItemId: string;
    returnQty: ReturnRentalOrderItem;
  }>();

  expanded = false;

  toggleExpand() {
    this.expanded = !this.expanded;
  }

  changeQty(orderItemId: string, delta: number) {
    const current = this.getQty(orderItemId);
    const next = Math.max(0, current + delta);
    this.quantityChange.emit({
      orderItemId,
      returnQty: { ...this.returnQuantities[orderItemId], goodQty: next },
    });
  }

  getQty(orderItemId: string): number {
    return orderItemId === this.item.id
      ? this.selectedQty.goodQty
      : (this.returnQuantities?.[orderItemId].goodQty ?? 0);
  }

  changeRepairQty(orderItemId: string, delta: number) {
    const current = this.getRepairQty(orderItemId);
    const next = Math.max(0, current + delta);
    this.quantityChange.emit({
      orderItemId,
      returnQty: { ...this.returnQuantities[orderItemId], repairQty: next },
    });
  }

  getRepairQty(orderItemId: string): number {
    return orderItemId === this.item.id
      ? this.selectedQty.repairQty
      : (this.returnQuantities?.[orderItemId].repairQty ?? 0);
  }

  changeDamagedQty(orderItemId: string, delta: number) {
    const current = this.getDamagedQty(orderItemId);
    const next = Math.max(0, current + delta);
    this.quantityChange.emit({
      orderItemId,
      returnQty: { ...this.returnQuantities[orderItemId], damagedQty: next },
    });
  }

  getDamagedQty(orderItemId: string): number {
    return orderItemId === this.item.id
      ? this.selectedQty.damagedQty
      : (this.returnQuantities?.[orderItemId].damagedQty ?? 0);
  }

  changeLostQty(orderItemId: string, delta: number) {
    const current = this.getLostQty(orderItemId);
    const next = Math.max(0, current + delta);
    this.quantityChange.emit({
      orderItemId,
      returnQty: { ...this.returnQuantities[orderItemId], lostQty: next },
    });
  }

  getLostQty(orderItemId: string): number {
    return orderItemId === this.item.id
      ? this.selectedQty.lostQty
      : (this.returnQuantities?.[orderItemId].lostQty ?? 0);
  }

  totalReturnQty(): number {
    return (
      (this.returnQuantities?.[this.item.id]?.goodQty ?? 0) +
      (this.returnQuantities?.[this.item.id]?.repairQty ?? 0) +
      (this.returnQuantities?.[this.item.id]?.damagedQty ?? 0) +
      (this.returnQuantities?.[this.item.id]?.lostQty ?? 0)
    );
  }
}
