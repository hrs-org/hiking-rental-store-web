import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ItemState } from './items.reducer';

export const selectItemState = createFeatureSelector<ItemState>('items');

export const selectItemList = createSelector(selectItemState, (state: ItemState) => state.items);

export const selectItemById = (id: string) =>
  createSelector(selectItemState, (state: ItemState) => state.items.find((item) => item.id === id));
