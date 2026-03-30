import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SKIP_AUTH } from '../tokens/auth.token';
import { ApiResponse } from '../models/api-response';
import { RegisterRequest } from '../models/user/registerUserReq';
import {
  REGISTER_AS_CUSTOMER,
  EMPLOYEES,
  ENSURE_USER_EXISTS as VALIDATE_USER_EXISTS,
  REGISTER_USER,
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

  registerAsCustomer(payload: {
    email: string;
    firstName: string;
    lastName: string;
    auth0UserId: string;
  }) {
    return this.http.post<ApiResponse<boolean>>(REGISTER_AS_CUSTOMER, payload);
  }

  validateUserExists() {
    return this.http.get<ApiResponse<boolean>>(VALIDATE_USER_EXISTS);
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
