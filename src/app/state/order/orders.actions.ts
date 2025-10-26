import { createAction, props } from '@ngrx/store';
import { Order } from '../../core/models/order/order';

export const loadReturnPageOrders = createAction('[Order] Load Return Page Orders');

export const loadReturnPageOrdersSuccess = createAction(
  '[Order] Load Return Page Orders Success',
  props<{ orders: Order[] }>(),
);

export const loadReturnPageOrdersFailure = createAction(
  '[Order] Load Return Page Orders Failure',
  props<{ error: unknown }>(),
);

export const loadBookingPageOrders = createAction('[Order] Load Booking Page Orders');

export const loadBookingPageOrdersSuccess = createAction(
  '[Order] Load Booking Page Orders Success',
  props<{ orders: Order[] }>(),
);

export const loadBookingPageOrdersFailure = createAction(
  '[Order] Load Booking Page Orders Failure',
  props<{ error: unknown }>(),
);
