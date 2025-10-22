import { Component, inject, OnInit } from '@angular/core';
import { PwaHeaderComponent } from '../../../shared/components/pwa-header/pwa-header.component';
import { ItemMaintenanceService } from '../../../core/services/item-maintenance.service';

@Component({
  selector: 'app-item-maintenance',
  imports: [PwaHeaderComponent],
  templateUrl: './item-maintenance.component.html',
  styleUrl: './item-maintenance.component.scss',
})
export class ItemMaintenanceComponent implements OnInit {
  itemMaintenanceService = inject(ItemMaintenanceService);

  ngOnInit(): void {
    this.itemMaintenanceService.getItemMaintenances().subscribe();
  }
}
