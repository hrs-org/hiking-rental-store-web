import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CatalogEntry } from '../../../core/models/store/store';
import { CurrencyPipe, NgClass } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-store-items',
  imports: [MatIconModule, MatButtonModule, NgClass, CurrencyPipe],
  templateUrl: './store-items.component.html',
  styleUrl: './store-items.component.scss',
})
export class StoreItemsComponent {
  @Input() item: CatalogEntry = {} as CatalogEntry;
  @Input() selectedQty = 0;
  @Input() childQuantities: Record<string, number> = {};

  @Output() quantityChange = new EventEmitter<{ catalogId: string; qty: number }>();

  expanded = false;

  toggleExpand() {
    this.expanded = !this.expanded;
  }

  changeQty(catalogId: string, delta: number) {
    const current = this.getQty(catalogId);
    const next = Math.max(0, current + delta);
    this.quantityChange.emit({ catalogId, qty: next });
  }

  getQty(catalogId: string): number {
    return catalogId === this.item.catalogId
      ? this.selectedQty
      : (this.childQuantities?.[catalogId] ?? 0);
  }
}
