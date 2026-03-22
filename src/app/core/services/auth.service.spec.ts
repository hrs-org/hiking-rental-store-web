import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { LoginRequest, LoginResponse, ChangePasswordRequest } from '../models/auth/auth';
import { ForgotPasswordRequest } from '../models/auth/forgot-password-request';
import { ResetPasswordRequest } from '../models/auth/reset-password-request';
import { EmailVerificationRequest } from '../models/auth/email-verification-request';
import { ResendVerificationRequest } from '../models/auth/resend-verification-request';
import { User, UserRole } from '../models/user/user';
import { ApiResponse } from '../models/api-response';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('login', () => {
    it('should send login request with credentials', () => {
      const loginRequest: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResponse: ApiResponse<LoginResponse> = {
        data: {
          userId: 1,
          token: 'jwt-token',
        },
        success: true,
        message: 'Login successful',
      };

      service.login(loginRequest).subscribe((response) => {
        expect(response.data?.token).toBe('jwt-token');
        expect(response.success).toBe(true);
      });

      const req = httpMock.expectOne((request) => request.url.includes('/login'));
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(loginRequest);
      req.flush(mockResponse);
    });

    it('should handle login error', () => {
      const loginRequest: LoginRequest = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      service.login(loginRequest).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.status).toBe(401);
        },
      );

      const req = httpMock.expectOne((request) => request.url.includes('/login'));
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('logout', () => {
    it('should send logout request', () => {
      service.logout().subscribe((response) => {
        expect(response.success).toBe(true);
      });

      const req = httpMock.expectOne((request) => request.url.includes('logout'));
      expect(req.request.method).toBe('POST');
      req.flush({ success: true, message: 'Logged out' });
    });
  });

  describe('getActiveUser', () => {
    it('should fetch active user', () => {
      const mockUser: User = {
        id: 1,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.Customer,
      };

      service.getActiveUser().subscribe((response) => {
        expect(response.data).toEqual(mockUser);
      });

      const req = httpMock.expectOne((request) => request.url.includes('active-user'));
      expect(req.request.method).toBe('GET');
      req.flush({ data: mockUser, success: true, message: '' });
    });
  });

  describe('changePassword', () => {
    it('should send change password request', () => {
      const changeRequest: ChangePasswordRequest = {
        currentPassword: 'oldPass123',
        newPassword: 'newPass456',
        confirmNewPassword: 'newPass456',
      };

      service.changePassword(changeRequest).subscribe((response) => {
        expect(response.success).toBe(true);
      });

      const req = httpMock.expectOne((request) => request.url.includes('change-password'));
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(changeRequest);
      req.flush({ success: true, message: 'Password changed', data: null });
    });
  });

  describe('forgotPassword', () => {
    it('should send forgot password request', () => {
      const forgotRequest: ForgotPasswordRequest = {
        email: 'test@example.com',
      };

      service.forgotPassword(forgotRequest).subscribe((response) => {
        expect(response.success).toBe(true);
      });

      const req = httpMock.expectOne((request) => request.url.includes('forgot-password'));
      expect(req.request.method).toBe('POST');
      req.flush({ success: true, message: 'Reset link sent', data: '' });
    });
  });

  describe('resetPassword', () => {
    it('should send reset password request with token', () => {
      const resetRequest: ResetPasswordRequest = {
        token: 'reset-token-123',
        newPassword: 'newPass789',
        email: 'test@example.com',
        confirmNewPassword: 'newPass789',
      };

      service.resetPassword(resetRequest).subscribe((response) => {
        expect(response.success).toBe(true);
      });

      const req = httpMock.expectOne((request) => request.url.includes('reset-password'));
      expect(req.request.method).toBe('POST');
      req.flush({ success: true, message: 'Password reset', data: '' });
    });
  });

  describe('verifyEmail', () => {
    it('should send email verification request', () => {
      const verifyRequest: EmailVerificationRequest = {
        email: 'test@example.com',
        verificationToken: 'verify-token-123',
      };

      service.verifyEmail(verifyRequest).subscribe((response) => {
        expect(response.success).toBe(true);
      });

      const req = httpMock.expectOne((request) => request.url.includes('verify-email'));
      expect(req.request.method).toBe('POST');
      req.flush({
        success: true,
        message: 'Email verified',
        data: { isVerified: true, message: 'Verified' },
      });
    });
  });

  describe('resendVerificationEmail', () => {
    it('should send resend verification request', () => {
      const resendRequest: ResendVerificationRequest = {
        email: 'test@example.com',
      };

      service.resendVerificationEmail(resendRequest).subscribe((response) => {
        expect(response.success).toBe(true);
      });

      const req = httpMock.expectOne((request) => request.url.includes('resend-verification'));
      expect(req.request.method).toBe('POST');
      req.flush({ success: true, message: 'Verification email sent', data: true });
    });
  });
});
