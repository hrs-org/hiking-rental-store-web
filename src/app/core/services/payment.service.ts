import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '../models/api-response';
import { CHECKOUTCART, CHECKOUTWITHPRICE, VERIFYPAMENT } from '../constants/api.constants';
import { BehaviorSubject } from 'rxjs';
import { Stripe } from '@stripe/stripe-js';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  http = inject(HttpClient);

  private clientSecretSource = new BehaviorSubject<string | null>(null);
  clientSecret$ = this.clientSecretSource.asObservable();

  getClientSecret(): string | null {
    return this.clientSecretSource.value;
  }

  checkoutPrice(orderName: string, price: number) {
    const body = {
      productname: orderName,
      amount: price,
    };
    return this.http.post<ApiResponse<{ clientSecret: string }>>(CHECKOUTWITHPRICE, body);
  }

  checkoutCart() {
    return this.http.get<ApiResponse<{ clientSecret: string }>>(CHECKOUTCART);
  }

  verifyCheckout(clientSecret: string, email: string) {
    const body = { clientSecret, email };
    return this.http.post<ApiResponse<{ session: Stripe }>>(VERIFYPAMENT, body);
  }
}
