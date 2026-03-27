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

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private readonly auth = inject(AuthService);
  private readonly auth0 = inject(Auth0Service);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

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
                },
              })
              .pipe(
                take(1),
                switchMap((token) => this.userService.getOnboardingStatus(token)),
                map((res) => {
                  const alreadyOnboarded = !!res.data;
                  if (alreadyOnboarded) return true;

                  const path = state.url || '/';
                  if (path.startsWith('/register-choice') || path.startsWith('/register/store')) {
                    return true;
                  }

                  return this.router.createUrlTree(['/register-choice']);
                }),
                catchError(() => of(true)),
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
}
