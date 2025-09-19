import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, switchMap, throwError } from 'rxjs';
import { SKIP_AUTH } from '../tokens/auth.token';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { LoginResponse } from '../models/auth/auth';
import { ApiResponse } from '../models/api-response';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  if (req.context.get(SKIP_AUTH)) {
    return next(req); // skip auth header
  }

  const token = localStorage.getItem('authToken');
  let apiReq = req;
  if (environment.production) {
    apiReq = req.clone({
      url: `${environment.apiUrl}${req.url}`,
    });
  }

  if (token) {
    apiReq = apiReq.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(apiReq).pipe(
    catchError((err) => {
      if (err.status === 401) {
        return authService.refreshToken().pipe(
          switchMap((refreshRes: ApiResponse<LoginResponse>) => {
            const newToken = refreshRes?.data?.token;
            if (newToken) {
              localStorage.setItem('authToken', newToken);

              const retryReq = apiReq.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` },
              });
              return next(retryReq);
            } else {
              localStorage.removeItem('authToken');
              window.location.href = '/login';
              return throwError(() => err);
            }
          }),
          catchError(() => {
            // Refresh failed
            localStorage.removeItem('authToken');
            window.location.href = '/login';
            return throwError(() => err);
          }),
        );
      }
      return throwError(() => err);
    }),
  );
};
