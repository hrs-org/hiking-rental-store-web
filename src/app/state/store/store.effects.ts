import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CatalogService } from '../../core/services/catalog.service';
import {
  loadCatalog,
  loadCatalogSuccess,
  loadCatalogFailure,
  loadStore,
  loadStoreSuccess,
  loadStoreFailure,
} from './store.actions';
import { catchError, finalize, map, mergeMap, of } from 'rxjs';
import { LoadingService } from '../../core/services/loading.service';
import { StoreService } from '../../core/services/store.service';

@Injectable()
export class StoreEffects {
  private readonly actions$ = inject(Actions);
  private readonly loadingService = inject(LoadingService);
  private readonly catalogService = inject(CatalogService);
  private readonly storeService = inject(StoreService);

  loadCatalogs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCatalog),
      mergeMap(({ startDate, endDate, storeId }) => {
        this.loadingService.show();
        return this.catalogService.getCatalog(startDate, endDate, storeId).pipe(
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

  loadStore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadStore),
      mergeMap(({ userId }) => {
        this.loadingService.show();
        return this.storeService.getStoreByUserId(userId).pipe(
          map((res) => {
            if (res && res.data) {
              return loadStoreSuccess({ store: res.data });
            } else {
              return loadStoreFailure({ error: 'No store found' });
            }
          }),
          finalize(() => this.loadingService.hide()),
          catchError((error) => of(loadStoreFailure({ error }))),
        );
      }),
    ),
  );
}
