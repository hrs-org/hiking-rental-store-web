import { createReducer, on } from '@ngrx/store';
import { loadPackagesSuccess } from './packages.actions';
import { Package } from '../../core/models/package/package';

export interface PackageState {
  packages: Package[];
}

export const initialState: PackageState = {
  packages: [],
};

export const packagesReducer = createReducer(
  initialState,
  on(
    loadPackagesSuccess,
    (state, { packages }): PackageState => ({ ...state, packages }),
  ),
);
