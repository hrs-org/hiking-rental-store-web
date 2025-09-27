import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../core/services/auth.service';
import { loadUser, loadUserSuccess, loadUserFailure } from './user.actions';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUser),
      mergeMap(() =>
        this.authService.getActiveUser().pipe(
          map((res) => {
            if (res.data) {
              return loadUserSuccess({ user: res.data });
            } else {
              return loadUserFailure({ error: 'User not found' });
            }
          }),
          catchError((error) => of(loadUserFailure({ error }))),
        ),
      ),
    ),
  );
}
