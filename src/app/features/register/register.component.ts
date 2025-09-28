import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { InfoBottomSheetComponent } from '../../shared/components/info-bottom-sheet/info-bottom-sheet.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatIcon],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private userService = inject(UserService);
  private bottomSheet = inject(MatBottomSheet);
  private router = inject(Router);

  // Loading state tracking
  isLoading = false;
  // Submission status tracking
  submitted = false;
  hidePassword = true;
  hideConfirmPassword = true;

  registerForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', Validators.required),
  });

  private openInfoSheet(title: string, description: string, callback?: () => void) {
    this.bottomSheet
      .open(InfoBottomSheetComponent, {
        data: {
          title,
          description,
          isConfirm: false,
          confirmButtonText: 'OK',
        },
      })
      .afterDismissed()
      .subscribe(() => {
        if (callback) callback();
      });
  }
  // Convenient method for getting form controls
  get firstName() {
    return this.registerForm.get('firstName');
  }
  get lastName() {
    return this.registerForm.get('lastName');
  }
  get email() {
    return this.registerForm.get('email');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  // Password matching verification
  get passwordsMatch(): boolean {
    const password = this.password?.value;
    const confirmPassword = this.confirmPassword?.value;
    return password === confirmPassword;
  }

  // Check if the field has errors
  hasError(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched || this.submitted));
  }

  // Get specific error information
  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
    if (!control || !control.errors) return '';

    const errors = control.errors;

    switch (controlName) {
      case 'firstName':
        if (errors['required']) return 'First name is required';
        if (errors['minlength']) return 'First name must be at least 2 characters';
        if (errors['pattern']) return 'First name can only contain letters and spaces';
        break;

      case 'lastName':
        if (errors['required']) return 'Last name is required';
        if (errors['minlength']) return 'Last name must be at least 2 characters';
        if (errors['pattern']) return 'Last name can only contain letters and spaces';
        break;

      case 'email':
        if (errors['required']) return 'Email is required';
        if (errors['email'] || errors['pattern']) return 'Please enter a valid email address';
        break;

      case 'password':
        if (errors['required']) return 'Password is required';
        if (errors['minlength']) return 'Password must be at least 8 characters';
        if (errors['pattern'])
          return 'Password must contain uppercase, lowercase, number and special character';
        break;

      case 'confirmPassword':
        if (errors['required']) return 'Please confirm your password';
        break;
    }

    return '';
  }

  // Check password matching errors
  getPasswordMatchError(): string {
    if (this.confirmPassword?.value && !this.passwordsMatch) {
      return 'Passwords do not match';
    }
    return '';
  }

  onSubmit() {
    // Set submitted to true on form submission
    this.submitted = true;

    // Detailed form validation
    if (!this.registerForm.valid) {
      console.log('Form is invalid:', this.registerForm.errors);
      this.markAllFieldsAsTouched();
      alert('Please fix the errors in the form');
      return;
    }

    // Password match verification
    if (!this.passwordsMatch) {
      console.log('Passwords do not match');
      alert('Passwords do not match');
      return;
    }

    const { password, confirmPassword, firstName, lastName, email } = this.registerForm.value;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      this.openInfoSheet(
        'Incomplete Form',
        'Please fill out all required fields before submitting the form.',
      );
      return;
    }
    if (password !== confirmPassword) {
      this.openInfoSheet(
        'Password Mismatch',
        'The passwords you entered do not match. Please try again.',
      );
      return;
    }
    this.userService.register({ firstName, lastName, email, password }).subscribe(() => {
      this.openInfoSheet(
        'Registration Successful',
        'You can now log in with your credentials.',
        () => this.navigateToLogin(),
      );
    });
  }

  // Mark all fields as touched
  private markAllFieldsAsTouched() {
    Object.keys(this.registerForm.controls).forEach((key) => {
      this.registerForm.get(key)?.markAsTouched();
    });
  }

  navigateToLogin() {
    if (!this.isLoading) {
      this.router.navigate(['login']);
    }
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }
}
