import { createAction, props } from '@ngrx/store';
import { Item } from '../../core/models/item/item';

export const loadItems = createAction('[Item] Load Items');

export const loadItemsSuccess = createAction(
  '[Item] Load Items Success',
  props<{ items: Item[] }>(),
);

export const loadItemsFailure = createAction(
  '[Item] Load Items Failure',
  props<{ error: unknown }>(),
);
