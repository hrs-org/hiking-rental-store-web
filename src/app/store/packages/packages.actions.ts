import { createAction, props } from '@ngrx/store';
import { Package } from '../../core/models/package/package';

export const loadPackages = createAction('[Package] Load Packages');

export const loadPackagesSuccess = createAction(
  '[Package] Load Packages Success',
  props<{ packages: Package[] }>(),
);

export const loadPackagesFailure = createAction(
  '[Package] Load Packages Failure',
  props<{ error: unknown }>(),
);
