import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ItemService } from '../../core/services/item.service';
import { loadItems, loadItemsSuccess, loadItemsFailure } from './items.actions';
import { catchError, finalize, map, mergeMap, of } from 'rxjs';
import { LoadingService } from '../../core/services/loading.service';

@Injectable()
export class ItemEffects {
  private readonly actions$ = inject(Actions);
  private readonly loadingService = inject(LoadingService);
  private readonly itemService = inject(ItemService);

  loadItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadItems),
      mergeMap(() => {
        this.loadingService.show();
        return this.itemService.getAllItems().pipe(
          map((res) => {
            if (res.data) {
              return loadItemsSuccess({ items: res.data });
            } else {
              return loadItemsFailure({ error: 'No items found' });
            }
          }),
          finalize(() => this.loadingService.hide()),
          catchError((error) => of(loadItemsFailure({ error }))),
        );
      }),
    ),
  );
}
