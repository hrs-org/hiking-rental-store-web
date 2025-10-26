import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CatalogService } from '../../core/services/catalog.service';
import { loadCatalog, loadCatalogSuccess, loadCatalogFailure } from './store.actions';
import { catchError, finalize, map, mergeMap, of } from 'rxjs';
import { LoadingService } from '../../core/services/loading.service';

@Injectable()
export class StoreEffects {
  private readonly actions$ = inject(Actions);
  private readonly loadingService = inject(LoadingService);
  private readonly StoreService = inject(CatalogService);

  loadStores$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCatalog),
      mergeMap(({ startDate, endDate }) => {
        this.loadingService.show();
        return this.StoreService.getCatalog(startDate, endDate).pipe(
          map((res) => {
            if (res) {
              return loadCatalogSuccess({ catalog: res });
            } else {
              return loadCatalogFailure({ error: 'No Catalog found' });
            }
          }),
          finalize(() => this.loadingService.hide()),
          catchError((error) => of(loadCatalogFailure({ error }))),
        );
      }),
    ),
  );
}
