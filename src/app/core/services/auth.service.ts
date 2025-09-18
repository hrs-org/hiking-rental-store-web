/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginRequest, LoginResponse } from '../models/auth/auth';
import { SKIP_AUTH } from '../tokens/auth.token';
import { ApiResponse } from '../models/api-response';
import { User } from '../models/user/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  http = inject(HttpClient);

  login(credentials: LoginRequest) {
    return this.http.post<ApiResponse<LoginResponse>>(`/api/auth/login`, credentials, {
      context: new HttpContext().set(SKIP_AUTH, true),
    });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  refreshToken() {
    return this.http.post<ApiResponse<LoginResponse>>(`/api/auth/refresh`, {
      context: new HttpContext().set(SKIP_AUTH, true),
    });
  }

  getUserById(userId: number) {
    return this.http.get<ApiResponse<User>>(`/api/user/${userId}`);
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
