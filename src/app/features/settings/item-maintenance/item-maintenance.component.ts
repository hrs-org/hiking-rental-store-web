import { Component, inject, OnInit } from '@angular/core';
import { PwaHeaderComponent } from '../../../shared/components/pwa-header/pwa-header.component';
import { ItemMaintenanceService } from '../../../core/services/item-maintenance.service';
import {
  ItemMaintenance,
  ItemMaintenanceFixRequest,
} from '../../../core/models/item-maintenance/item-maintenance';
import { ItemMaintenanceItemComponent } from './item-maintenance-item/item-maintenance-item.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { InfoBottomSheetComponent } from '../../../shared/components/info-bottom-sheet/info-bottom-sheet.component';

@Component({
  selector: 'app-item-maintenance',
  imports: [PwaHeaderComponent, ItemMaintenanceItemComponent],
  templateUrl: './item-maintenance.component.html',
  styleUrl: './item-maintenance.component.scss',
})
export class ItemMaintenanceComponent implements OnInit {
  private itemMaintenanceService = inject(ItemMaintenanceService);
  private bottomSheet = inject(MatBottomSheet);

  itemMaintenance: ItemMaintenance[] = [];
  isFixing = false;

  ngOnInit(): void {
    this.loadItemMaintenances();
  }

  loadItemMaintenances(): void {
    this.itemMaintenanceService.getItemMaintenances().subscribe((res) => {
      if (res.success && res.data) {
        this.itemMaintenance = res.data;
      }
    });
  }

  onFixItem(item: ItemMaintenance): void {
    const remainingQuantity = item.quantity - (item.quantityFixed || 0);

    const request: ItemMaintenanceFixRequest = {
      id: item.id,
      quantityFixed: item.quantity,
    };

    this.isFixing = true;
    this.itemMaintenanceService.fixItemMaintenance(request).subscribe({
      next: (res) => {
        this.isFixing = false;

        if (res.success) {
          this.bottomSheet
            .open(InfoBottomSheetComponent, {
              data: {
                title: 'Success',
                description: `Successfully fixed ${remainingQuantity} item(s).`,
                isConfirm: false,
                confirmButtonText: 'OK',
              },
            })
            .afterDismissed()
            .subscribe(() => {
              this.loadItemMaintenances();
            });
        }
      },
      error: () => {
        this.isFixing = false;
      },
    });
  }
}
