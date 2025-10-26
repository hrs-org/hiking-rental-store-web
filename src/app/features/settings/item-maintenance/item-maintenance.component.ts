import { Component, inject, OnInit } from '@angular/core';
import { PwaHeaderComponent } from '../../../shared/components/pwa-header/pwa-header.component';
import { ItemMaintenanceService } from '../../../core/services/item-maintenance.service';
import { Store } from '@ngrx/store';
import { selectStore } from '../../../state/store/store.selector';
import { ItemMaintenance } from '../../../core/models/item-maintenance/item-maintenance';
import { ItemMaintenanceItemComponent } from './item-maintenance-item/item-maintenance-item.component';

@Component({
  selector: 'app-item-maintenance',
  imports: [PwaHeaderComponent, ItemMaintenanceItemComponent],
  templateUrl: './item-maintenance.component.html',
  styleUrl: './item-maintenance.component.scss',
})
export class ItemMaintenanceComponent implements OnInit {
  private itemMaintenanceService = inject(ItemMaintenanceService);
  private store = inject(Store);

  store$ = this.store.select(selectStore);
  itemMaintenance: ItemMaintenance[] = [];

  ngOnInit(): void {
    this.store$.subscribe((store) => {
      if (store) {
        this.itemMaintenanceService.getItemMaintenanceByStoreId(store.id).subscribe((res) => {
          if (res.data) this.itemMaintenance = res.data;
        });
      }
    });
  }
}
