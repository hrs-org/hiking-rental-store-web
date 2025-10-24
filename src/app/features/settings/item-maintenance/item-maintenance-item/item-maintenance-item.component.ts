import { Component, Input } from '@angular/core';
import { ItemMaintenance } from '../../../../core/models/item-maintenance/item-maintenance';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-item-maintenance-item',
  imports: [MatIcon],
  templateUrl: './item-maintenance-item.component.html',
  styleUrl: './item-maintenance-item.component.scss',
})
export class ItemMaintenanceItemComponent {
  @Input() itemMMaintenance?: ItemMaintenance;

  onItemClick() {
    if (this.itemMMaintenance) {
      console.log('Item clicked:', this.itemMMaintenance);
    }
  }
}
