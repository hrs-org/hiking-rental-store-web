import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PackageState } from './packages.reducer';

export const selectPackageState = createFeatureSelector<PackageState>('packages');

export const selectPackageList = createSelector(
  selectPackageState,
  (state: PackageState) => state.packages,
);

export const selectPackageById = (id: number) =>
  createSelector(selectPackageState, (state: PackageState) =>
    state.packages.find((pkg) => pkg.id === id),
  );
