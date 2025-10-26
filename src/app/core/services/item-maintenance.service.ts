import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ITEM_MAINTENANCE_FIX, ITEM_MAINTENANCE_PREFIX } from '../constants/api.constants';
import {
  ItemMaintenance,
  ItemMaintenanceFixRequest,
} from '../models/item-maintenance/item-maintenance';

@Injectable({ providedIn: 'root' })
export class ItemMaintenanceService {
  http = inject(HttpClient);

  getItemMaintenances() {
    return this.http.get<ItemMaintenance[]>(ITEM_MAINTENANCE_PREFIX);
  }

  fixItemMaintenance(request: ItemMaintenanceFixRequest) {
    return this.http.post(ITEM_MAINTENANCE_FIX.replace('{0}', `${request.id}`), request);
  }
}
