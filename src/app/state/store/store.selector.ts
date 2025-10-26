import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StoreState } from './store.reducer';

export const selectStoreState = createFeatureSelector<StoreState>('store');

export const selectCatalog = createSelector(selectStoreState, (state: StoreState) => state.catalog);

export const selectStore = createSelector(selectStoreState, (state: StoreState) => state.storeInfo);
