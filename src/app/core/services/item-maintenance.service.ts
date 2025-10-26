import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ITEM_MAINTENANCE_FIX, ITEM_MAINTENANCE_PREFIX } from '../constants/api.constants';
import {
  ItemMaintenance,
  ItemMaintenanceFixRequest,
} from '../models/item-maintenance/item-maintenance';
import { ApiResponse } from '../models/api-response';

@Injectable({ providedIn: 'root' })
export class ItemMaintenanceService {
  http = inject(HttpClient);

  getItemMaintenances() {
    return this.http.get<ItemMaintenance[]>(ITEM_MAINTENANCE_PREFIX);
  }

  fixItemMaintenance(request: ItemMaintenanceFixRequest) {
    return this.http.post(ITEM_MAINTENANCE_FIX.replace('{0}', `${request.id}`), request);
  }

  getItemMaintenanceByStoreId(id: string) {
    return this.http.get<ApiResponse<ItemMaintenance[]>>(
      `${ITEM_MAINTENANCE_PREFIX}/items?storeId=${id}`,
    );
  }
}
