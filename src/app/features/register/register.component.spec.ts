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
    it('should be invalid when empty', () => {
      expect(component.registerForm.valid).toBeFalse();
    });

    //required fields
    it('should validate required fields', () => {
      const firstNameControl = component.registerForm.get('firstName');
      const lastNameControl = component.registerForm.get('lastName');
      const emailControl = component.registerForm.get('email');
      const passwordControl = component.registerForm.get('password');
      const confirmPasswordControl = component.registerForm.get('confirmPassword');

      expect(firstNameControl?.hasError('required')).toBeTrue();
      expect(lastNameControl?.hasError('required')).toBeTrue();
      expect(emailControl?.hasError('required')).toBeTrue();
      expect(passwordControl?.hasError('required')).toBeTrue();
      expect(confirmPasswordControl?.hasError('required')).toBeTrue();
    });

    //email format
    it('should validate email format', () => {
      const emailControl = component.registerForm.get('email');

      // Invalid email
      emailControl?.setValue('invalid-email');
      expect(emailControl?.hasError('email')).toBeTrue();

      // Valid email
      emailControl?.setValue('valid@email.com');
      expect(emailControl?.hasError('email')).toBeFalse();
    });

    //password minimum length
    it('should validate password minimum length', () => {
      const passwordControl = component.registerForm.get('password');

      //minimum Length password
      passwordControl?.setValue('123');
      expect(passwordControl?.hasError('minlength')).toBeTrue();

      //valid length password
      passwordControl?.setValue('12345678');
      expect(passwordControl?.hasError('minlength')).toBeFalse();
    });

    //all required fields correctly filled
    it('should be valid with all required fields correctly filled', () => {
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
    //toggle password visibility
    it('should toggle password visibility', () => {
      expect(component.hidePassword).toBeTrue();

      component.togglePasswordVisibility();
      expect(component.hidePassword).toBeFalse();

      component.togglePasswordVisibility();
      expect(component.hidePassword).toBeTrue();
    });

    // toggle confirm password visibility
    it('should toggle confirm password visibility', () => {
      expect(component.hideConfirmPassword).toBeTrue();

      component.toggleConfirmPasswordVisibility();
      expect(component.hideConfirmPassword).toBeFalse();

      component.toggleConfirmPasswordVisibility();
      expect(component.hideConfirmPassword).toBeTrue();
    });

    //detect password match
    it('should detect password match', () => {
      component.registerForm.patchValue({
        password: '12345678',
        confirmPassword: '12345678',
      });
      expect(component.passwordsMatch).toBeTrue();
    });

    //mismatched passwords
    it('should detect mismatched passwords', () => {
      component.registerForm.patchValue({
        password: '12345678',
        confirmPassword: '87654321',
      });
      expect(component.passwordsMatch).toBeFalse();
    });

    //password mismatch error message
    it('should return password match error message', () => {
      component.registerForm.patchValue({
        confirmPassword: '12345678',
      });

      component.registerForm.patchValue({
        password: '87654321',
      });
      expect(component.getPasswordMatchError()).toBe('Passwords do not match');
    });

    //passwords match no error
    it('should return empty string when passwords match', () => {
      component.registerForm.patchValue({
        password: 'password123',
        confirmPassword: 'password123',
      });

      expect(component.getPasswordMatchError()).toBe('');
    });
  });
  describe('Error Handling', () => {
    beforeEach(() => {
      component.submitted = true;
    });

    // Field errors can be detected after submission
    it('should detect field errors when submitted', () => {
      expect(component.hasError('firstName')).toBeTrue();
      expect(component.hasError('email')).toBeTrue();
    });

    // Return correct error message
    it('should return correct error messages', () => {
      expect(component.getErrorMessage('firstName')).toBe('First name is required');
      expect(component.getErrorMessage('lastName')).toBe('Last name is required');
      expect(component.getErrorMessage('email')).toBe('Email is required');
      expect(component.getErrorMessage('password')).toBe('Password is required');
      expect(component.getErrorMessage('confirmPassword')).toBe('Please confirm your password');
    });

    //email format error message
    it('should return email format error message', () => {
      const emailControl = component.registerForm.get('email');
      emailControl?.setValue('invalid-email');
      emailControl?.markAsTouched();

      expect(component.getErrorMessage('email')).toBe('Please enter a valid email address');
    });

    //password length error message
    it('should return password length error message', () => {
      const passwordControl = component.registerForm.get('password');
      passwordControl?.setValue('123');
      passwordControl?.markAsTouched();

      expect(component.getErrorMessage('password')).toBe('Password must be at least 8 characters');
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      // Fill form with valid data before each submission test
      component.registerForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
    });

    // invalid form should not submit
    it('should not submit if form is invalid', () => {
      component.registerForm.patchValue({
        firstName: '',
      });
      component.onSubmit();
      expect(mockUserService.register).not.toHaveBeenCalled();
      expect(component.submitted).toBeTrue();
    });

    // password mismatch should not submit
    it('should not submit if passwords do not match', () => {
      component.registerForm.patchValue({
        confirmPassword: '87654321',
      });

      component.onSubmit();

      expect(mockUserService.register).not.toHaveBeenCalled();
    });

    // valid form should submit
    it('should submit valid form', () => {
      mockUserService.register.and.returnValue(of({ success: true, message: '', data: null }));

      component.onSubmit();

      expect(mockUserService.register).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      });
    });

    // loading state during submission
    it('should set loading state during submission', () => {
      mockUserService.register.and.returnValue(of({ success: true, message: '', data: null }));

      component.onSubmit();

      expect(component.isLoading).toBeFalse();
    });

    // prevent multiple submissions
    it('should prevent submission when already loading', () => {
      component.isLoading = true;
      mockUserService.register.and.returnValue(of({ success: true, message: '', data: null }));

      component.onSubmit();

      expect(mockUserService.register).not.toHaveBeenCalled();
    });
  });

  describe('Navigation', () => {
    // navigate to login on back to login click
    it('should navigate to login when handleBackToLogin is called', () => {
      const mockEvent = new Event('click');
      spyOn(mockEvent, 'preventDefault');

      component.handleBackToLogin(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['login']);
    });

    // prevent navigation when loading
    it('should not navigate when loading', () => {
      component.isLoading = true;
      const mockEvent = new Event('click');
      spyOn(mockEvent, 'preventDefault');

      component.handleBackToLogin(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    // direct navigation to login
    it('should navigate to login directly when navigateToLogin is called', () => {
      component.navigateToLogin();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['login']);
    });

    // prevent navigation when loading in navigateToLogin
    it('should not navigate when loading in navigateToLogin', () => {
      component.isLoading = true;

      component.navigateToLogin();

      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('Form State Management', () => {
    // disable form when loading
    it('should disable form when loading', () => {
      component['setLoadingState'](true);

      expect(component.isLoading).toBeTrue();
      expect(component.registerForm.disabled).toBeTrue();
    });

    // enable form when not loading
    it('should enable form when not loading', () => {
      component['setLoadingState'](false);

      expect(component.isLoading).toBeFalse();
      expect(component.registerForm.enabled).toBeTrue();
    });

    // mark all fields as touched
    it('should mark all fields as touched when markAllFieldsAsTouched is called', () => {
      component['markAllFieldsAsTouched']();

      expect(component.registerForm.get('firstName')?.touched).toBeTrue();
      expect(component.registerForm.get('lastName')?.touched).toBeTrue();
      expect(component.registerForm.get('email')?.touched).toBeTrue();
      expect(component.registerForm.get('password')?.touched).toBeTrue();
      expect(component.registerForm.get('confirmPassword')?.touched).toBeTrue();
    });
  });

  describe('Getter Methods', () => {
    // correct form controls
    it('should return correct form controls', () => {
      expect(component.firstName).toBe(component.registerForm.get('firstName'));
      expect(component.lastName).toBe(component.registerForm.get('lastName'));
      expect(component.email).toBe(component.registerForm.get('email'));
      expect(component.password).toBe(component.registerForm.get('password'));
      expect(component.confirmPassword).toBe(component.registerForm.get('confirmPassword'));
    });
  });

  describe('InfoBottomSheet Integration', () => {
    it('should open bottom sheet on successful registration', () => {
      component.registerForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });

      mockUserService.register.and.returnValue(of({ success: true, message: '', data: null }));

      component.onSubmit();

      expect(mockBottomSheet.open).toHaveBeenCalledWith(
        jasmine.anything(),
        jasmine.objectContaining({
          data: jasmine.objectContaining({
            title: 'Registration Successful',
            description: 'You can now log in with your credentials.',
          }),
        }),
      );
    });

    it('should open bottom sheet on registration error', () => {
      component.registerForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });

      mockUserService.register.and.returnValue(throwError(() => new Error('Registration failed')));

      component.onSubmit();

      expect(mockBottomSheet.open).toHaveBeenCalledWith(
        jasmine.anything(),
        jasmine.objectContaining({
          data: jasmine.objectContaining({
            title: 'Registration Failed',
            description: 'Something went wrong during registration. Please try again.',
          }),
        }),
      );
    });
  });
});
