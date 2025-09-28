import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
// import { LoginRequest, LoginResponse } from '../models/auth/auth';
import { SKIP_AUTH } from '../tokens/auth.token';
import { ApiResponse } from '../models/api-response';
import { RegisterRequest } from '../models/user/registerUserReq';
import { REGISTER_USER } from '../constants/api.constants';

@Injectable({ providedIn: 'root' })
export class UserService {
  http = inject(HttpClient);

  // register new user
  register(userDetails: RegisterRequest) {
    return this.http.post<ApiResponse<null>>(REGISTER_USER, userDetails, {
      context: new HttpContext().set(SKIP_AUTH, true),
    });
  }
}
