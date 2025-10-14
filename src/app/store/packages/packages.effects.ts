import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PackageService } from '../../core/services/package.service';
import { loadPackages, loadPackagesSuccess, loadPackagesFailure } from './packages.actions';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class PackageEffects {
  private readonly actions$ = inject(Actions);
  private readonly packageService = inject(PackageService);

  loadPackages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPackages),
      mergeMap(() =>
        this.packageService.getAllPackages().pipe(
          map((res) => {
            if (res.data) {
              return loadPackagesSuccess({ packages: res.data });
            } else {
              return loadPackagesFailure({ error: 'No packages found' });
            }
          }),
          catchError((error) => of(loadPackagesFailure({ error }))),
        ),
      ),
    ),
  );
}
