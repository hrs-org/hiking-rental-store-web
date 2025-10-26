import { createReducer, on } from '@ngrx/store';
import { loadCatalogSuccess, loadStoreSuccess } from './store.actions';
import { CatalogEntry, StoreDto } from '../../core/models/store/store';

export interface StoreState {
  catalog: CatalogEntry[];
  storeInfo?: StoreDto;
}

export const initialState: StoreState = {
  catalog: [],
  storeInfo: undefined,
};

export const storeReducer = createReducer(
  initialState,
  on(loadCatalogSuccess, (state, { catalog }): StoreState => ({ ...state, catalog })),
  on(loadStoreSuccess, (state, { store }): StoreState => ({ ...state, storeInfo: store })),
);
