import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '../models/api-response';
import { StoreDto } from '../models/store/StoreDto';
import { RegisterStoreDto } from '../models/store/RegisterStoreDto';
import { STORE_PREFIX } from '../constants/api.constants';

@Injectable({ providedIn: 'root' })
export class StoreService {
  http = inject(HttpClient);

  // get store by id
  getStoreById(storeId: number) {
    return this.http.get<ApiResponse<StoreDto>>(`${STORE_PREFIX}/${storeId}`);
  }

  // get store by user id
  getStoreByUserId(userId: number) {
    return this.http.get<ApiResponse<StoreDto>>(`${STORE_PREFIX}/user/${userId}`);
  }

  // get all stores
  getAllStores() {
    return this.http.get<ApiResponse<StoreDto[]>>(STORE_PREFIX);
  }

  // register store
  registerStore(dto: RegisterStoreDto) {
    return this.http.post<ApiResponse<boolean>>(`${STORE_PREFIX}/register`, dto);
  }
}
