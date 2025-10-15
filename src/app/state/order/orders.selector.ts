import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OrderState } from './orders.reducer';

export const selectOrderState = createFeatureSelector<OrderState>('orders');

export const selectReturnPageOrderList = createSelector(
  selectOrderState,
  (state: OrderState) => state.returnPages,
);

export const selectBookingPageOrderList = createSelector(
  selectOrderState,
  (state: OrderState) => state.bookingPages,
);
