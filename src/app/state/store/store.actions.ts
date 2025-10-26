import { createAction, props } from '@ngrx/store';
import { CatalogEntry } from '../../core/models/store/store';

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
