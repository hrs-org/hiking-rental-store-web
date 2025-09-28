import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, switchMap, throwError } from 'rxjs';
import { SKIP_AUTH } from '../tokens/auth.token';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { LoginResponse } from '../models/auth/auth';
import { ApiResponse } from '../models/api-response';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { InfoBottomSheetComponent } from '../../shared/components/info-bottom-sheet/info-bottom-sheet.component';

function showBottomSheet(bottomSheet: MatBottomSheet, title: string, description: string) {
  bottomSheet
    .open(InfoBottomSheetComponent, {
      data: { title, description, isConfirm: false, confirmButtonText: 'OK' },
    })
    .afterDismissed()
    .subscribe();
}

function handle401Error(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  apiReq: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
  bottomSheet: MatBottomSheet,
) {
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
        showBottomSheet(
          bottomSheet,
          'Session Expired',
          'Your session has expired. Please log in again.',
        );
        return throwError(() => err);
      }
    }),
    catchError(() => {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
      showBottomSheet(
        bottomSheet,
        'Session Expired',
        'Unable to refresh session. Please log in again.',
      );
      return throwError(() => err);
    }),
  );
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const bottomSheet = inject(MatBottomSheet);

  let apiReq = req;
  if (environment.apiUrl && !req.url.startsWith('http')) {
    apiReq = req.clone({ url: `${environment.apiUrl}${req.url}` });
  }

  if (apiReq.context.get(SKIP_AUTH)) {
    return next(apiReq).pipe(
      catchError((err) => {
        showBottomSheet(bottomSheet, 'Error', 'An unexpected error occurred.');
        return throwError(() => err);
      }),
    );
  }

  const token = localStorage.getItem('authToken');
  if (token) {
    apiReq = apiReq.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(apiReq).pipe(
    catchError((err) => {
      if (err.status === 401) {
        return handle401Error(err, apiReq, next, authService, bottomSheet);
      }

      showBottomSheet(bottomSheet, 'Error', 'An unexpected error occurred.');
      return throwError(() => err);
    }),
  );
};
