import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, finalize, map, mergeMap, of } from 'rxjs';
import { LoadingService } from '../../core/services/loading.service';
import { OrderService } from '../../core/services/order.service';
import {
  loadBookingPageOrders,
  loadBookingPageOrdersFailure,
  loadBookingPageOrdersSuccess,
  loadReturnPageOrders,
  loadReturnPageOrdersFailure,
  loadReturnPageOrdersSuccess,
} from './orders.actions';

@Injectable()
export class OrderEffects {
  private readonly actions$ = inject(Actions);
  private readonly loadingService = inject(LoadingService);
  private readonly orderService = inject(OrderService);

  loadRentalPageOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadReturnPageOrders),
      mergeMap(() => {
        this.loadingService.show();
        return this.orderService.getReturnPageOrders().pipe(
          map((res) => {
            if (res.data) {
              return loadReturnPageOrdersSuccess({ orders: res.data });
            } else {
              return loadReturnPageOrdersFailure({ error: 'No Orders found' });
            }
          }),
          finalize(() => this.loadingService.hide()),
          catchError((error) => of(loadReturnPageOrdersFailure({ error }))),
        );
      }),
    ),
  );

  loadBookingPageOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadBookingPageOrders),
      mergeMap(() => {
        this.loadingService.show();
        return this.orderService.getBookingPageOrders().pipe(
          map((res) => {
            if (res.data) {
              return loadBookingPageOrdersSuccess({ orders: res.data });
            } else {
              return loadBookingPageOrdersFailure({ error: 'No Orders found' });
            }
          }),
          finalize(() => this.loadingService.hide()),
          catchError((error) => of(loadBookingPageOrdersFailure({ error }))),
        );
      }),
    ),
  );
}
