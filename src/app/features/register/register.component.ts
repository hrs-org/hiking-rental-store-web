import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { InfoBottomSheetComponent } from '../../shared/components/info-bottom-sheet/info-bottom-sheet.component';
import { MatIcon } from '@angular/material/icon';
import { LoadingService } from '../../core/services/loading.service';
import { StoreService } from '../../core/services/store.service';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIcon,
    MatSelectModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  private userService = inject(UserService);
  private storeService = inject(StoreService);
  private loadingService = inject(LoadingService);
  private bottomSheet = inject(MatBottomSheet);
  private router = inject(Router);

  submitted = false;
  hidePassword = true;
  hideConfirmPassword = true;

  options = [
    { value: 'User', viewValue: 'Register as User' },
    { value: 'Store', viewValue: 'Register as Store' },
  ];

  registerForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', Validators.required),
    option: new FormControl('User', Validators.required),
    storeName: new FormControl(''),
    storeAddress: new FormControl(''),
    storeDescription: new FormControl(''),
    storePhoneNumber: new FormControl('', Validators.pattern('^\\+?[0-9\\- ]{7,15}$')),
  });

  ngOnInit(): void {
    this.registerForm.get('option')?.valueChanges.subscribe((value) => {
      const storeName = this.registerForm.get('storeName');
      const storeAddr = this.registerForm.get('storeAddress');
      if (value === 'Store') {
        storeName?.setValidators([Validators.required]);
        storeAddr?.setValidators([Validators.required]);
      } else {
        storeName?.clearValidators();
        storeAddr?.clearValidators();
        storeName?.setValue('');
        storeAddr?.setValue('');
      }
      storeName?.updateValueAndValidity();
      storeAddr?.updateValueAndValidity();
    });
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

      case 'storeName':
        if (errors['required']) return 'Store name is required';
        break;

      case 'storeAddress':
        if (errors['required']) return 'Store address is required';
        break;

      case 'storePhoneNumber':
        if (errors['pattern']) return 'Please enter a valid phone number';
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

    const {
      password,
      firstName,
      lastName,
      email,
      option,
      storeName,
      storeAddress,
      storeDescription,
      storePhoneNumber,
    } = this.registerForm.value;

    this.loadingService.show();
    if (option === 'Store') {
      this.storeService
        .registerStore({
          firstName: firstName!,
          lastName: lastName!,
          email: email!,
          password: password!,
          name: storeName!,
          address: storeAddress!,
          description: storeDescription!,
          phoneNumber: storePhoneNumber!,
        })
        .subscribe({
          next: () => {
            this.openInfoSheet(
              'Registration Successful',
              'You can now log in with your credentials.',
              () => this.navigateToLogin(),
            );
          },
          complete: () => this.loadingService.hide(),
        });
      return;
    } else {
      this.userService
        .register({
          firstName: firstName!,
          lastName: lastName!,
          email: email!,
          password: password!,
        })
        .subscribe({
          next: () => {
            this.openInfoSheet(
              'Registration Successful',
              'You can now log in with your credentials.',
              () => this.navigateToLogin(),
            );
          },
          complete: () => this.loadingService.hide(),
        });
    }
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
    this.router.navigate(['login']);
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }
}
