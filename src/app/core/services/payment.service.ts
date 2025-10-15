import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '../models/api-response';
import { PAYMENT_CREATE_SESSION, PAYMENT_VERIFY } from '../constants/api.constants';
import {
  PaymentRequest as PaymentRequestDto,
  PaymentVerifyRequestDto,
} from '../models/payment/payment';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  http = inject(HttpClient);

  createPaymentSession(request: PaymentRequestDto) {
    return this.http.post<ApiResponse<{ client_secret: string }>>(PAYMENT_CREATE_SESSION, request);
  }

  verifyCheckout(request: PaymentVerifyRequestDto) {
    return this.http.post<ApiResponse<object>>(PAYMENT_VERIFY, request);
  }
}
