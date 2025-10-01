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

  isLoading = false;
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

  private setLoadingState(loading: boolean): void {
    this.isLoading = loading;

    if (loading) {
      this.registerForm.disable();
    } else {
      this.registerForm.enable();
    }
  }

  private openInfoSheet(title: string, description: string, callback?: () => void): void {
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

  get passwordsMatch(): boolean {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;
    return password === confirmPassword;
  }

  hasError(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched || this.submitted));
  }

  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
    if (!control || !control.errors) return '';

    const errors = control.errors;

    switch (controlName) {
      case 'firstName':
        if (errors['required']) return 'First name is required';
        break;

      case 'lastName':
        if (errors['required']) return 'Last name is required';
        break;

      case 'email':
        if (errors['required']) return 'Email is required';
        if (errors['email']) return 'Please enter a valid email address';
        break;

      case 'password':
        if (errors['required']) return 'Password is required';
        if (errors['minlength']) return 'Password must be at least 8 characters';
        break;

      case 'confirmPassword':
        if (errors['required']) return 'Please confirm your password';
        break;
    }

    return '';
  }

  getPasswordMatchError(): string {
    if (this.registerForm.get('confirmPassword')?.value && !this.passwordsMatch) {
      return 'Passwords do not match';
    }
    return '';
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.registerForm.invalid) {
      this.markAllFieldsAsTouched();
      return;
    }

    if (!this.passwordsMatch) {
      return;
    }

    const { password, firstName, lastName, email } = this.registerForm.value;

    if (this.isLoading) return;
    this.setLoadingState(true);

    this.userService
      .register({
        firstName: firstName!,
        lastName: lastName!,
        email: email!,
        password: password!,
      })
      .subscribe({
        next: () => {
          this.setLoadingState(false);
          this.openInfoSheet(
            'Registration Successful',
            'You can now log in with your credentials.',
            () => this.navigateToLogin(),
          );
        },
        error: () => {
          this.setLoadingState(false);
          this.openInfoSheet(
            'Registration Failed',
            'Something went wrong during registration. Please try again.',
          );
        },
      });
  }

  private markAllFieldsAsTouched() {
    Object.keys(this.registerForm.controls).forEach((key) => {
      this.registerForm.get(key)?.markAsTouched();
    });
  }

  handleBackToLogin(event: Event): void {
    event.preventDefault();
    this.navigateToLogin();
  }

  navigateToLogin(): void {
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
