import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { provideHttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { UserService } from '../../core/services/user.service';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockBottomSheet: jasmine.SpyObj<MatBottomSheet>;

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['register']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockBottomSheet = jasmine.createSpyObj('MatBottomSheet', ['open']);

    const mockBottomSheetRef = {
      afterDismissed: () => of(undefined),
    };
    mockBottomSheet.open.and.returnValue(
      mockBottomSheetRef as unknown as ReturnType<MatBottomSheet['open']>,
    );

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule, BrowserAnimationsModule],
      providers: [
        provideHttpClient(),
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
        { provide: MatBottomSheet, useValue: mockBottomSheet },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize form with empty values', () => {
      expect(component.registerForm.value).toEqual({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    });
  });

  describe('Form Validation', () => {
    it('should be invalid when required fields are empty', () => {
      expect(component.registerForm.valid).toBeFalse();
      expect(component.registerForm.get('firstName')?.hasError('required')).toBeTrue();
      expect(component.registerForm.get('email')?.hasError('required')).toBeTrue();
    });

    it('should validate email format and password length', () => {
      const emailControl = component.registerForm.get('email');
      const passwordControl = component.registerForm.get('password');

      emailControl?.setValue('invalid-email');
      expect(emailControl?.hasError('email')).toBeTrue();

      passwordControl?.setValue('123');
      expect(passwordControl?.hasError('minlength')).toBeTrue();
    });

    it('should be valid with correct data', () => {
      component.registerForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: '12345678',
        confirmPassword: '12345678',
      });
      expect(component.registerForm.valid).toBeTrue();
    });
  });

  describe('Password Functionality', () => {
    it('should toggle password visibility', () => {
      expect(component.hidePassword).toBeTrue();
      component.togglePasswordVisibility();
      expect(component.hidePassword).toBeFalse();

      expect(component.hideConfirmPassword).toBeTrue();
      component.toggleConfirmPasswordVisibility();
      expect(component.hideConfirmPassword).toBeFalse();
    });

    it('should validate password matching', () => {
      component.registerForm.patchValue({
        password: '12345678',
        confirmPassword: '12345678',
      });
      expect(component.passwordsMatch).toBeTrue();
      expect(component.getPasswordMatchError()).toBe('');

      component.registerForm.patchValue({ confirmPassword: '87654321' });
      expect(component.passwordsMatch).toBeFalse();
      expect(component.getPasswordMatchError()).toBe('Passwords do not match');
    });
  });
  describe('Error Handling', () => {
    beforeEach(() => {
      component.submitted = true;
    });

    it('should detect field errors and return correct messages', () => {
      expect(component.hasError('firstName')).toBeTrue();
      expect(component.getErrorMessage('firstName')).toBe('First name is required');
      expect(component.getErrorMessage('email')).toBe('Email is required');

      const emailControl = component.registerForm.get('email');
      emailControl?.setValue('invalid-email');
      emailControl?.markAsTouched();
      expect(component.getErrorMessage('email')).toBe('Please enter a valid email address');

      const passwordControl = component.registerForm.get('password');
      passwordControl?.setValue('123');
      passwordControl?.markAsTouched();
      expect(component.getErrorMessage('password')).toBe('Password must be at least 8 characters');
    });
  });

  describe('Form Submission', () => {
    const validFormData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    };

    it('should not submit invalid form or mismatched passwords', () => {
      component.registerForm.patchValue({ ...validFormData, firstName: '' });
      component.onSubmit();
      expect(mockUserService.register).not.toHaveBeenCalled();
      expect(component.submitted).toBeTrue();

      component.registerForm.patchValue({ ...validFormData, confirmPassword: '87654321' });
      component.onSubmit();
      expect(mockUserService.register).not.toHaveBeenCalled();
    });

    it('should submit valid form and handle success/error', () => {
      component.registerForm.patchValue(validFormData);
      mockUserService.register.and.returnValue(of({ success: true, message: '', data: null }));

      component.onSubmit();

      expect(mockUserService.register).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      });
    });

    it('should prevent double submission when loading', () => {
      component.isLoading = true;
      component.registerForm.patchValue(validFormData);

      component.onSubmit();
      expect(mockUserService.register).not.toHaveBeenCalled();
    });
  });

  describe('Navigation', () => {
    it('should handle back to login navigation', () => {
      const mockEvent = new Event('click');
      spyOn(mockEvent, 'preventDefault');

      component.handleBackToLogin(mockEvent);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['login']);

      mockRouter.navigate.calls.reset();
      component.isLoading = true;
      component.navigateToLogin();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('Form State Management', () => {
    it('should manage loading state and form enabling/disabling', () => {
      component['setLoadingState'](true);
      expect(component.isLoading).toBeTrue();
      expect(component.registerForm.disabled).toBeTrue();

      component['setLoadingState'](false);
      expect(component.isLoading).toBeFalse();
      expect(component.registerForm.enabled).toBeTrue();
    });

    it('should mark all fields as touched', () => {
      component['markAllFieldsAsTouched']();
      Object.keys(component.registerForm.controls).forEach((key) => {
        expect(component.registerForm.get(key)?.touched).toBeTrue();
      });
    });
  });

  describe('InfoBottomSheet Integration', () => {
    const validFormData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    };

    it('should open bottom sheet on registration success and error', () => {
      component.registerForm.patchValue(validFormData);

      mockUserService.register.and.returnValue(of({ success: true, message: '', data: null }));
      component.onSubmit();
      expect(mockBottomSheet.open).toHaveBeenCalledWith(
        jasmine.anything(),
        jasmine.objectContaining({
          data: jasmine.objectContaining({
            title: 'Registration Successful',
          }),
        }),
      );

      mockBottomSheet.open.calls.reset();
      mockUserService.register.and.returnValue(throwError(() => new Error('Registration failed')));
      component.onSubmit();
      expect(mockBottomSheet.open).toHaveBeenCalledWith(
        jasmine.anything(),
        jasmine.objectContaining({
          data: jasmine.objectContaining({
            title: 'Registration Failed',
          }),
        }),
      );
    });
  });
});
