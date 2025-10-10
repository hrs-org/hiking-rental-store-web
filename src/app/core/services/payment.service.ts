import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '../models/api-response';
import { CHECKOUTWITHPRICE } from '../constants/api.constants';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  http = inject(HttpClient);

  checkoutPrice(orderName: string, price: number) {
    const body = {
      productname: orderName,
      amount: price,
    };
    return this.http.post<ApiResponse<{ clientSecret: string }>>(CHECKOUTWITHPRICE, body);
  }
}
