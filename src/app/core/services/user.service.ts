import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SKIP_AUTH } from '../tokens/auth.token';
import { ApiResponse } from '../models/api-response';
import { RegisterRequest } from '../models/user/registerUserReq';
import {
  ASSIGN_CUSTOMER_ROLE,
  EMPLOYEES,
  REGISTER_USER,
  USER_ONBOARDING_STATUS,
} from '../constants/api.constants';
import { Employee } from '../models/user/employee';

@Injectable({ providedIn: 'root' })
export class UserService {
  http = inject(HttpClient);

  register(userDetails: RegisterRequest) {
    return this.http.post<ApiResponse<null>>(REGISTER_USER, userDetails, {
      context: new HttpContext().set(SKIP_AUTH, true),
    });
  }

  assignCustomerRole(
    payload: {
      auth0UserId: string;
      email: string;
      firstName: string;
      lastName: string;
    },
    token: string,
  ) {
    return this.http.post<ApiResponse<boolean>>(ASSIGN_CUSTOMER_ROLE, payload, {
      context: new HttpContext().set(SKIP_AUTH, true),
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
    });
  }

  getOnboardingStatus(token: string) {
    return this.http.get<ApiResponse<boolean>>(USER_ONBOARDING_STATUS, {
      context: new HttpContext().set(SKIP_AUTH, true),
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
    });
  }

  loadEmployees() {
    return this.http.get<ApiResponse<Employee[]>>(EMPLOYEES);
  }
  UpdateEmployee(emp: Employee) {
    return this.http.put<ApiResponse<Employee>>(EMPLOYEES, emp);
  }
  CreateEmployee(emp: Employee) {
    return this.http.post<ApiResponse<Employee>>(`${EMPLOYEES}/add`, emp);
  }
  DeleteEmployee(empId: number) {
    return this.http.delete<ApiResponse<null>>(`${EMPLOYEES}/${empId}`);
  }
}
