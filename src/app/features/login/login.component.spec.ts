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
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
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

    // Get the router from TestBed after configuration
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
      expect(component.isDarkTheme).toBe(false);
    });

    it('should initialize form with empty values and validators', () => {
      expect(component.loginForm.get('email')?.value).toBe('');
      expect(component.loginForm.get('password')?.value).toBe('');
      expect(component.loginForm.get('email')?.hasError('required')).toBe(true);
      expect(component.loginForm.get('password')?.hasError('required')).toBe(true);
    });
  });

  describe('Form Validation', () => {
    it('should show error for invalid email', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('invalid-email');
      emailControl?.markAsTouched();

      expect(component.hasError('email')).toBe(true);
      expect(component.getErrorMessage('email')).toBe('Please enter a valid email');
    });

    it('should show error for required email', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('');
      emailControl?.markAsTouched();

      expect(component.hasError('email')).toBe(true);
      expect(component.getErrorMessage('email')).toBe('Email is required');
    });

    it('should show error for required password', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('');
      passwordControl?.markAsTouched();

      expect(component.hasError('password')).toBe(true);
      expect(component.getErrorMessage('password')).toBe('Password is required');
    });

    it('should show error for short password', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('123');
      passwordControl?.markAsTouched();

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

  describe('Theme Toggle', () => {
    it('should toggle theme', () => {
      expect(component.isDarkTheme).toBe(false);

      component.toggleTheme();
      expect(component.isDarkTheme).toBe(true);
      expect(localStorage.getItem('theme')).toBe('dark');

      component.toggleTheme();
      expect(component.isDarkTheme).toBe(false);
      expect(localStorage.getItem('theme')).toBe('light');
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

    it('should mark all fields as touched when form is invalid', () => {
      component.loginForm.patchValue({
        email: '',
        password: '',
      });

      component.onSubmit();

      expect(component.loginForm.get('email')?.touched).toBe(true);
      expect(component.loginForm.get('password')?.touched).toBe(true);
    });

    it('should prevent submission when loading', () => {
      component.isLoading = true;
      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'password123',
      });
      component.onSubmit();

      expect(mockAuthService.login).not.toHaveBeenCalled();
    });

    it('should call auth service on valid form submission', () => {
      mockAuthService.login.and.returnValue(of(mockAuthResponse));
      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'password123',
      });
      component.onSubmit();

      expect(mockAuthService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should handle successful login', () => {
      mockAuthService.login.and.returnValue(of(mockAuthResponse));
      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'password123',
      });
      component.onSubmit();

      expect(localStorage.getItem('authToken')).toBe('test-token');
      expect(mockStore.dispatch).toHaveBeenCalled();
    });

    it('should navigate to home on successful login', (done) => {
      const mockUser = { id: 123, email: 'test@example.com' };
      mockStore.select.and.returnValue(of(mockUser));
      mockAuthService.login.and.returnValue(of(mockAuthResponse));

      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'password123',
      });

      component.onSubmit();

      // Wait for async operations to complete
      setTimeout(() => {
        expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
        done();
      }, 100);
    });

    it('should handle login error', () => {
      mockAuthService.login.and.returnValue(throwError(() => new Error('Login failed')));
      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'password123',
      });
      component.onSubmit();

      expect(mockBottomSheet.open).toHaveBeenCalled();
    });
  });

  describe('Navigation', () => {
    it('should navigate to register page', () => {
      component.onClickRegister();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['register']);
    });

    it('should not navigate to register when loading', () => {
      component.isLoading = true;

      component.onClickRegister();

      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Events', () => {
    it('should submit form on Enter key', () => {
      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'password123',
      });
      mockAuthService.login.and.returnValue(of(mockAuthResponse));

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      component.onKeydown(event);

      expect(mockAuthService.login).toHaveBeenCalled();
    });

    it('should not submit on Enter when loading', () => {
      component.isLoading = true;

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      component.onKeydown(event);

      expect(mockAuthService.login).not.toHaveBeenCalled();
    });
  });

  describe('Private Methods', () => {
    it('should set loading state correctly', () => {
      component['setLoadingState'](true);

      expect(component.isLoading).toBe(true);
      expect(component.loginForm.disabled).toBe(true);

      component['setLoadingState'](false);

      expect(component.isLoading).toBe(false);
      expect(component.loginForm.disabled).toBe(false);
    });

    it('should show error message via bottom sheet', () => {
      // Access private method using bracket notation
      component['showErrorMessage']('Test Title', 'Test Description');

      expect(mockBottomSheet.open).toHaveBeenCalled();
    });
  });

  describe('Error Message Helper Methods', () => {
    it('should return correct error messages', () => {
      const emailControl = component.loginForm.get('email');
      const passwordControl = component.loginForm.get('password');

      emailControl?.setErrors({ required: true });
      expect(component.getErrorMessage('email')).toBe('Email is required');

      emailControl?.setErrors({ email: true });
      expect(component.getErrorMessage('email')).toBe('Please enter a valid email');

      passwordControl?.setErrors({ required: true });
      expect(component.getErrorMessage('password')).toBe('Password is required');

      passwordControl?.setErrors({ minlength: { requiredLength: 6, actualLength: 3 } });
      expect(component.getErrorMessage('password')).toBe('Password must be at least 6 characters');
    });
  });

  describe('hasError Method', () => {
    it('should return true when control is invalid and touched/dirty/submitted', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setErrors({ required: true });

      emailControl?.markAsTouched();
      expect(component.hasError('email')).toBe(true);

      emailControl?.markAsUntouched();
      emailControl?.markAsDirty();
      expect(component.hasError('email')).toBe(true);
    });

    it('should return false when control is valid or not touched/dirty/submitted', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('test@example.com');
      emailControl?.markAsTouched();

      expect(component.hasError('email')).toBe(false);
      expect(component.hasError('nonExistentField')).toBe(false);
    });
  });

  describe('Component Lifecycle', () => {
    it('should initialize with light theme when no theme is saved', () => {
      localStorage.removeItem('theme');
      component.ngOnInit();
      expect(component.isDarkTheme).toBe(false);
    });

    it('should initialize with dark theme when dark theme is saved', () => {
      localStorage.setItem('theme', 'dark');
      component.ngOnInit();
      expect(component.isDarkTheme).toBe(true);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle login response without token', () => {
      const responseWithoutToken: ApiResponse<LoginResponse> = {
        success: true,
        message: 'Login successful',
        data: {
          token: '',
          userId: 123,
        },
      };

      mockAuthService.login.and.returnValue(of(responseWithoutToken));
      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'password123',
      });

      component.onSubmit();

      expect(mockAuthService.login).toHaveBeenCalled();
      expect(mockStore.dispatch).not.toHaveBeenCalled();
    });

    it('should prevent multiple submissions when already loading', () => {
      component.isLoading = true;
      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'password123',
      });

      component.onSubmit();

      expect(mockAuthService.login).not.toHaveBeenCalled();
    });
  });

  afterEach(() => {
    localStorage.clear();
  });
});
