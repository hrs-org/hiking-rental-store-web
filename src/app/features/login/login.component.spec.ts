import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of, throwError } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterTestingModule } from '@angular/router/testing';

import { LoginComponent } from './login.component';
import { AuthService } from '../../core/services/auth.service';
import { ApiResponse } from '../../core/models/api-response';
import { LoginResponse } from '../../core/models/auth/auth';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockStore: jasmine.SpyObj<Store>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockBottomSheet: jasmine.SpyObj<MatBottomSheet>;

  const mockAuthResponse: ApiResponse<LoginResponse> = {
    success: true,
    message: 'Login successful',
    data: {
      token: 'test-token',
      userId: 123,
    },
  };

  beforeEach(async () => {
    mockStore = jasmine.createSpyObj('Store', ['dispatch', 'select']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['login']);
    mockBottomSheet = jasmine.createSpyObj('MatBottomSheet', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        MatBottomSheetModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatProgressSpinnerModule,
      ],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: AuthService, useValue: mockAuthService },
        { provide: MatBottomSheet, useValue: mockBottomSheet },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    spyOn(mockRouter, 'navigate');

    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.hidePassword).toBe(true);
      expect(component.isLoading).toBe(false);
      expect(component.submitted).toBe(false);
    });

    it('should initialize form with empty values and validators', () => {
      expect(component.loginForm.get('email')?.value).toBe('');
      expect(component.loginForm.get('password')?.value).toBe('');
      expect(component.loginForm.get('email')?.hasError('required')).toBe(true);
      expect(component.loginForm.get('password')?.hasError('required')).toBe(true);
    });
  });

  describe('Form Validation', () => {
    it('should show email validation errors', () => {
      const emailControl = component.loginForm.get('email');

      emailControl?.setValue('');
      emailControl?.markAsTouched();
      expect(component.hasError('email')).toBe(true);
      expect(component.getErrorMessage('email')).toBe('Email is required');

      emailControl?.setValue('invalid-email');
      expect(component.hasError('email')).toBe(true);
      expect(component.getErrorMessage('email')).toBe('Please enter a valid email');
    });

    it('should show password validation errors', () => {
      const passwordControl = component.loginForm.get('password');

      passwordControl?.setValue('');
      passwordControl?.markAsTouched();
      expect(component.hasError('password')).toBe(true);
      expect(component.getErrorMessage('password')).toBe('Password is required');

      passwordControl?.setValue('123');
      expect(component.hasError('password')).toBe(true);
      expect(component.getErrorMessage('password')).toBe('Password must be at least 6 characters');
    });

    it('should validate correct form input', () => {
      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(component.loginForm.valid).toBe(true);
      expect(component.hasError('email')).toBe(false);
      expect(component.hasError('password')).toBe(false);
    });

    it('should return empty string for unknown control name in getErrorMessage', () => {
      expect(component.getErrorMessage('unknownField')).toBe('');
    });

    it('should return empty string when control has no errors', () => {
      component.loginForm.get('email')?.setValue('test@example.com');
      expect(component.getErrorMessage('email')).toBe('');
    });

    it('should handle error checking in different states', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('');

      component.submitted = true;
      expect(component.hasError('email')).toBe(true);

      component.submitted = false;
      emailControl?.markAsDirty();
      expect(component.hasError('email')).toBe(true);
    });
  });

  describe('Password Visibility', () => {
    it('should toggle password visibility', () => {
      expect(component.hidePassword).toBe(true);

      component.togglePasswordVisibility();
      expect(component.hidePassword).toBe(false);

      component.togglePasswordVisibility();
      expect(component.hidePassword).toBe(true);
    });
  });

  describe('Navigation', () => {
    it('should navigate to register page', () => {
      component.onClickRegister();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['register']);
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should not submit invalid form', () => {
      component.loginForm.patchValue({
        email: '',
        password: '',
      });

      component.onSubmit();

      expect(mockAuthService.login).not.toHaveBeenCalled();
      expect(component.submitted).toBe(true);
    });

    it('should prevent submission when loading', () => {
      component.isLoading = true;
      component.onSubmit();

      expect(mockAuthService.login).not.toHaveBeenCalled();
    });

    it('should call auth service on valid form submission', () => {
      mockAuthService.login.and.returnValue(of(mockAuthResponse));
      component.onSubmit();

      expect(mockAuthService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should handle successful login', () => {
      mockAuthService.login.and.returnValue(of(mockAuthResponse));
      component.onSubmit();

      expect(localStorage.getItem('authToken')).toBe('test-token');
      expect(mockStore.dispatch).toHaveBeenCalled();
    });

    it('should handle login error', () => {
      mockAuthService.login.and.returnValue(throwError(() => new Error('Login failed')));
      component.onSubmit();

      expect(mockBottomSheet.open).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle invalid login response data', () => {
      const testCases = [
        { token: '', userId: 123, description: 'without token' },
        { token: 'test-token', userId: 0, description: 'without userId' },
        null,
      ];

      testCases.forEach((data) => {
        const response = {
          success: true,
          message: 'Login successful',
          data: data,
        } as ApiResponse<LoginResponse>;

        mockAuthService.login.and.returnValue(of(response));
        component.loginForm.patchValue({
          email: 'test@example.com',
          password: 'password123',
        });

        component.onSubmit();

        expect(mockAuthService.login).toHaveBeenCalled();
        if (data && data.token && data.userId) {
          expect(mockStore.dispatch).toHaveBeenCalled();
        } else {
          expect(mockStore.dispatch).not.toHaveBeenCalled();
        }
      });
    });

    it('should handle store select returning null user', () => {
      mockAuthService.login.and.returnValue(of(mockAuthResponse));
      mockStore.select.and.returnValue(of(null));

      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'password123',
      });

      component.onSubmit();

      expect(mockStore.dispatch).toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  afterEach(() => {
    localStorage.clear();
  });
});
