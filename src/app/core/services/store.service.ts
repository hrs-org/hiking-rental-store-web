import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '../models/api-response';
import {
  STORE_GETBYID,
  STORE_PREFIX,
  STORE_REGISTER,
  STORE_USER,
} from '../constants/api.constants';
import { RegisterStoreDto, StoreDto } from '../models/store/store';

@Injectable({ providedIn: 'root' })
export class StoreService {
  http = inject(HttpClient);

  // get store by id
  getStoreById(storeId: number) {
    return this.http.get<ApiResponse<StoreDto>>(STORE_GETBYID.replace('{0}', `${storeId}`));
  }

  // get store by user id
  getStoreByUserId(userId: number) {
    return this.http.get<ApiResponse<StoreDto>>(STORE_USER.replace('{0}', `${userId}`));
  }

  // get all stores
  getAllStores() {
    return this.http.get<ApiResponse<StoreDto[]>>(STORE_PREFIX);
  }

  // register store
  registerStore(dto: RegisterStoreDto) {
    return this.http.post<ApiResponse<boolean>>(STORE_REGISTER, dto);
  }
}
