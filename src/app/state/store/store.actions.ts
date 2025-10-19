import { createAction, props } from '@ngrx/store';
import { CatalogEntry } from '../../core/models/store/store';
import { StoreDto } from '../../core/models/store/StoreDto';

export const loadCatalog = createAction(
  '[Store] Load Catalog',
  props<{ startDate: Date; endDate: Date }>(),
);

export const loadCatalogSuccess = createAction(
  '[Store] Load Catalog Success',
  props<{ catalog: CatalogEntry[] }>(),
);

export const loadCatalogFailure = createAction(
  '[Store] Load Catalog Failure',
  props<{ error: unknown }>(),
);

export const loadStore = createAction('[Store] Load Store', props<{ userId: number }>());

export const loadStoreSuccess = createAction(
  '[Store] Load Store Success',
  props<{ store: StoreDto }>(),
);

export const loadStoreFailure = createAction(
  '[Store] Load Store Failure',
  props<{ error: unknown }>(),
);
