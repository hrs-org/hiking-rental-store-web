import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Order, OrderRequest, ReturnRentalOrderItemRequest } from '../models/order/order';
import {
  ORDER_APPROVE,
  ORDER_BOOKINGS,
  ORDER_CANCEL,
  ORDER_CLOSE,
  ORDER_CONFIRM,
  ORDER_PREFIX,
  ORDER_RENTS,
  ORDER_RETURN,
} from '../constants/api.constants';
import { ApiResponse } from '../models/api-response';

@Injectable({ providedIn: 'root' })
export class OrderService {
  http = inject(HttpClient);

  getOrderById(orderId: string) {
    return this.http.get<ApiResponse<Order>>(`${ORDER_PREFIX}/${orderId}`);
  }

  getBookingPageOrders() {
    return this.http.get<ApiResponse<Order[]>>(ORDER_BOOKINGS);
  }

  getReturnPageOrders() {
    return this.http.get<ApiResponse<Order[]>>(ORDER_RENTS);
  }

  createOrder(order: OrderRequest) {
    return this.http.post<ApiResponse<Order>>(ORDER_PREFIX, order);
  }

  approveOrder(orderId: string) {
    return this.http.put<ApiResponse<Order>>(ORDER_APPROVE.replace('{0}', `${orderId}`), {});
  }

  cancelOrder(orderId: string) {
    return this.http.put<ApiResponse<Order>>(ORDER_CANCEL.replace('{0}', `${orderId}`), {});
  }

  confirmOrder(orderId: string) {
    return this.http.put<ApiResponse<Order>>(ORDER_CONFIRM.replace('{0}', `${orderId}`), {});
  }

  returnOrderItem(orderId: string, items: ReturnRentalOrderItemRequest) {
    return this.http.put<ApiResponse<Order>>(ORDER_RETURN.replace('{0}', `${orderId}`), items);
  }

  closeOrder(orderId: string) {
    return this.http.put<ApiResponse<Order>>(ORDER_CLOSE.replace('{0}', `${orderId}`), {});
  }
}
