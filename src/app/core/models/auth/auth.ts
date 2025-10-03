export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  userId: number;
  token: string;
}

export interface LogOutResponse {
  success: boolean;
  message: string;
}

export interface ChangePasswordRequest {
  confirmNewPassword: string;
  currentPassword: string;
  newPassword: string;
}
