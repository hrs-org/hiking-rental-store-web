import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginRequest, LoginResponse } from '../models/auth/auth';
import { SKIP_AUTH } from '../tokens/auth.token';
import { ApiResponse } from '../models/api-response';

@Injectable({ providedIn: 'root' })
export class AuthService {
  http = inject(HttpClient);

  login(credentials: LoginRequest) {
    return this.http.post<ApiResponse<LoginResponse>>(`/api/auth/login`, credentials, {
      context: new HttpContext().set(SKIP_AUTH, true),
    });
  }
}
