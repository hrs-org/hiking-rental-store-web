import { Component, Input, output } from '@angular/core';
import {
  ItemMaintenance,
  ItemMaintenanceType,
} from '../../../../core/models/item-maintenance/item-maintenance';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-item-maintenance-item',
  imports: [MatIcon, CommonModule, MatButtonModule],
  templateUrl: './item-maintenance-item.component.html',
  styleUrl: './item-maintenance-item.component.scss',
})
export class ItemMaintenanceItemComponent {
  @Input() itemMaintenance?: ItemMaintenance;
  fixClicked = output<ItemMaintenance>();
  readonly ItemMaintenanceType = ItemMaintenanceType;

  onFixClick(event: Event) {
    event.stopPropagation();
    if (this.itemMaintenance) {
      this.fixClicked.emit(this.itemMaintenance);
    }
  }

  isFullyFixed(): boolean {
    if (!this.itemMaintenance) return false;

    if (this.itemMaintenance.type !== ItemMaintenanceType.Repair) return false;

    const fixed = this.itemMaintenance.quantityFixed || 0;
    return fixed >= this.itemMaintenance.quantity;
  }

  getTypeClass(type: ItemMaintenanceType): string {
    const classes: Record<string, string> = {
      [ItemMaintenanceType.Repair]: 'type-repair',
      [ItemMaintenanceType.Fixed]: 'type-fixed',
      [ItemMaintenanceType.Broken]: 'type-broken',
      [ItemMaintenanceType.Lost]: 'type-lost',
    };
    return classes[type] || '';
  }
}
