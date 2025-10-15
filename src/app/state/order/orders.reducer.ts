import { createReducer, on } from '@ngrx/store';
import { Order } from '../../core/models/order/order';
import { loadBookingPageOrdersSuccess, loadReturnPageOrdersSuccess } from './orders.actions';

export interface OrderState {
  returnPages: Order[];
  bookingPages: Order[];
}

export const initialState: OrderState = {
  returnPages: [],
  bookingPages: [],
};

export const ordersReducer = createReducer(
  initialState,
  on(
    loadReturnPageOrdersSuccess,
    (state, { orders }): OrderState => ({ ...state, returnPages: orders }),
  ),
  on(
    loadBookingPageOrdersSuccess,
    (state, { orders }): OrderState => ({ ...state, bookingPages: orders }),
  ),
);
