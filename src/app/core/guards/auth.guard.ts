import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { Observable, of, switchMap, take, catchError, map } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';
import { UserService } from '../services/user.service';
import { Store } from '@ngrx/store';
import { loadUser } from '../../state/user/user.actions';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private readonly auth = inject(AuthService);
  private readonly auth0 = inject(Auth0Service);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly store = inject(Store);

  canActivate(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (environment.auth0?.enabled) {
      return this.auth0.isAuthenticated$.pipe(
        take(1),
        switchMap((isAuthenticated) => {
          if (isAuthenticated) {
            return this.auth0
              .getAccessTokenSilently({
                authorizationParams: {
                  audience: environment.auth0.audience,
                  scope: 'openid profile email offline_access',
                },
                cacheMode: 'off',
              })
              .pipe(
                take(1),
                switchMap((token) => {
                  localStorage.setItem('authToken', token);

                  const hasUserIdClaim = this.hasUserIdClaim(token);
                  return this.userService
                    .validateUserExists()
                    .pipe(map((res) => ({ res, hasUserIdClaim })));
                }),
                map(({ res, hasUserIdClaim }) => {
                  const alreadyOnboarded = !!res.data;
                  if (alreadyOnboarded) {
                    if (!hasUserIdClaim) {
                      this.store.dispatch(loadUser());
                      return true;
                    }

                    this.store.dispatch(loadUser());
                    return true;
                  }

                  const path = state.url || '/';
                  if (path.startsWith('/register-choice') || path.startsWith('/register/store')) {
                    return true;
                  }

                  return this.router.createUrlTree(['/register-choice']);
                }),
                catchError(() => {
                  localStorage.removeItem('authToken');
                  return of(this.router.createUrlTree(['/register-choice']));
                }),
              );
          }

          return this.auth0
            .loginWithRedirect({
              appState: {
                target: state.url || '/',
              },
              authorizationParams: {
                redirect_uri: globalThis.location.origin,
                audience: environment.auth0.audience,
                scope: 'openid profile email offline_access',
              },
            })
            .pipe(
              map(() => false),
              catchError(() => of(false)),
            );
        }),
      );
    }

    if (this.auth.isLoggedIn()) {
      return true;
    }
    return false;
  }

  private hasUserIdClaim(token: string): boolean {
    try {
      const payloadPart = token.split('.')[1];
      if (!payloadPart) {
        return false;
      }

      const payload = JSON.parse(atob(payloadPart.replace(/-/g, '+').replace(/_/g, '/')));
      const userIdClaimKey = `${environment.auth0.audience}/userId`;
      const userId = Number(payload?.[userIdClaimKey]);

      return Number.isInteger(userId) && userId > 0;
    } catch {
      return false;
    }
  }
}
