import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../core/services/auth.service';
import { loadUser, loadUserSuccess, loadUserFailure } from './user.actions';
import { loadStore } from '../store/store.actions';
import { catchError, finalize, mergeMap, of, switchMap } from 'rxjs';
import { LoadingService } from '../../core/services/loading.service';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);
  private readonly loadingService = inject(LoadingService);
  private authService = inject(AuthService);

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUser),
      mergeMap(() => {
        this.loadingService.show();
        return this.authService.getActiveUser().pipe(
          switchMap((res) => {
            if (res.data) {
              const user = res.data;
              if (user.role === 'Admin' || user.role === 'Manager') {
                return [loadUserSuccess({ user }), loadStore({ userId: user.id })];
              }
              return [loadUserSuccess({ user })];
            } else {
              return [loadUserFailure({ error: 'User not found' })];
            }
          }),
          finalize(() => this.loadingService.hide()),
          catchError((error) => of(loadUserFailure({ error }))),
        );
      }),
    ),
  );
}
