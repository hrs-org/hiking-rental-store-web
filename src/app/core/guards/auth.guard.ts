import { inject, Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { Observable, of, switchMap, take, catchError, map } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private auth = inject(AuthService);
  private auth0 = inject(Auth0Service);

  canActivate(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (environment.auth0?.enabled) {
      return this.auth0.isAuthenticated$.pipe(
        take(1),
        switchMap((isAuthenticated) => {
          if (isAuthenticated) {
            return of(true);
          }

          return this.auth0.loginWithRedirect().pipe(
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
