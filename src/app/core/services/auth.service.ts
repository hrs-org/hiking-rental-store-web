/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { environment } from '../../../environments/environment';
import { ACTIVE_USER } from '../constants/api.constants';
import { ApiResponse } from '../models/api-response';
import { User } from '../models/user/user';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  http = inject(HttpClient);
  auth0 = inject(Auth0Service, { optional: true });

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getActiveUser() {
    return this.http.get<ApiResponse<User>>(ACTIVE_USER);
  }

  canChangePasswordWithAuth0(): Observable<boolean> {
    if (!environment.auth0?.enabled || !this.auth0) {
      return of(false);
    }

    return this.auth0.user$.pipe(
      map((profile) => {
        const auth0Subject = profile?.sub ?? '';
        return auth0Subject.startsWith('auth0|');
      }),
      catchError(() => of(false)),
    );
  }

  requestAuth0PasswordChange(email: string): Observable<void> {
    const auth0Config = environment.auth0;
    if (!auth0Config?.enabled) {
      return of(void 0);
    }

    const endpoint = `https://${auth0Config.domain}/dbconnections/change_password`;
    return this.http
      .post(
        endpoint,
        {
          client_id: auth0Config.clientId,
          email,
          connection: auth0Config.databaseConnection,
        },
        { responseType: 'text' },
      )
      .pipe(map(() => void 0));
  }

  refreshAccessToken(): Observable<string | null> {
    if (!environment.auth0?.enabled || !this.auth0) {
      return of(null);
    }

    return this.auth0.getAccessTokenSilently({
      authorizationParams: {
        audience: environment.auth0.audience,
        scope: 'openid profile email offline_access',
      },
      cacheMode: 'off',
    });
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp;
      if (!exp) return true;
      return Date.now() >= exp * 1000;
    } catch (_) {
      return true;
    }
  }
}
