export interface EmailVerificationRequest {
  email: string;
  verificationToken: string;
}
export interface EmailVerificationResponse {
  success: boolean;
  message: string;
}
