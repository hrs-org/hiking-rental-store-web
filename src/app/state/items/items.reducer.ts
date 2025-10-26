import { createReducer, on } from '@ngrx/store';
import { loadItemsSuccess } from './items.actions';
import { Item } from '../../core/models/item/item';

export interface ItemState {
  items: Item[];
}

export const initialState: ItemState = {
  items: [],
};

export const itemsReducer = createReducer(
  initialState,
  on(loadItemsSuccess, (state, { items }): ItemState => ({ ...state, items: items })),
);
