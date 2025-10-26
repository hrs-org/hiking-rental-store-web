import { createReducer, on } from '@ngrx/store';
import { loadCatalogSuccess } from './store.actions';
import { CatalogEntry } from '../../core/models/store/store';

export interface StoreState {
  catalog: CatalogEntry[];
}

export const initialState: StoreState = {
  catalog: [],
};

export const storeReducer = createReducer(
  initialState,
  on(loadCatalogSuccess, (state, { catalog }): StoreState => ({ ...state, catalog })),
);
