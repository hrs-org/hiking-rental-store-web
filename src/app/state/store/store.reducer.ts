import { createReducer, on } from '@ngrx/store';
import { loadCatalogSuccess, loadStoreSuccess } from './store.actions';
import { CatalogEntry } from '../../core/models/store/store';
import { StoreDto } from '../../core/models/store/StoreDto';

export interface StoreState {
  catalog: CatalogEntry[];
  storeInfo: StoreDto | null;
  loading: boolean;
  error: unknown;
}

export const initialState: StoreState = {
  catalog: [],
  storeInfo: null,
  loading: false,
  error: null,
};

export const storeReducer = createReducer(
  initialState,
  on(loadCatalogSuccess, (state, { catalog }): StoreState => ({ ...state, catalog })),
  on(
    loadStoreSuccess,
    (state, { store }): StoreState => ({
      ...state,
      storeInfo: store,
      loading: false,
    }),
  ),
);
