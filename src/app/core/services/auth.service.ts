/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginRequest, LoginResponse, LogOutResponse } from '../models/auth/auth';
import { ResendVerificationRequest } from '../models/auth/resend-verification-request';
import { EmailVerificationRequest } from '../models/auth/email-verification-request';
import { SKIP_AUTH } from '../tokens/auth.token';
import { ApiResponse } from '../models/api-response';
import { User } from '../models/user/user';
import {
  ACTIVE_USER,
  LOGIN,
  LOGOUT,
  REFRESH_TOKEN,
  RESEND_VERIFICATION,
  VERIFY_EMAIL,
} from '../constants/api.constants';

@Injectable({ providedIn: 'root' })
export class AuthService {
  http = inject(HttpClient);

  login(credentials: LoginRequest) {
    return this.http.post<ApiResponse<LoginResponse>>(LOGIN, credentials, {
      context: new HttpContext().set(SKIP_AUTH, true),
    });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  refreshToken() {
    return this.http.post<ApiResponse<LoginResponse>>(REFRESH_TOKEN, {
      context: new HttpContext().set(SKIP_AUTH, true),
    });
  }

  logout() {
    return this.http.post<ApiResponse<LogOutResponse>>(LOGOUT, {});
  }

  getActiveUser() {
    return this.http.get<ApiResponse<User>>(ACTIVE_USER);
  }

  resendVerificationEmail(request: ResendVerificationRequest) {
    return this.http.post<ApiResponse<boolean>>(RESEND_VERIFICATION, request, {
      context: new HttpContext().set(SKIP_AUTH, true),
    });
  }

  verifyEmail(request: EmailVerificationRequest) {
    return this.http.post<ApiResponse<{ isVerified: boolean; message: string }>>(
      VERIFY_EMAIL,
      request,
      {
        context: new HttpContext().set(SKIP_AUTH, true),
      },
    );
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
