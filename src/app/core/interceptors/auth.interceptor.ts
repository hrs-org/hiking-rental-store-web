import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, throwError } from 'rxjs';
import { SKIP_AUTH } from '../tokens/auth.token';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
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
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
      return throwError(() => err);
    }),
  );
};
