import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { take, tap, finalize, filter } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { Store } from '@ngrx/store';
import { loadUser } from '../../state/user/user.actions';
import { MatIconModule } from '@angular/material/icon';
import { selectUser } from '../../state/user/user.selector';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { LoadingService } from '../../core/services/loading.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private authService = inject(AuthService);
  private loadingService = inject(LoadingService);
  private router = inject(Router);
  private store = inject(Store);
  private bottomSheet = inject(MatBottomSheet);

  hidePassword = true;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  hasError(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);
    if (!control || !control.errors) return '';

    switch (controlName) {
      case 'email':
        if (control.errors['required']) return 'Email is required';
        if (control.errors['email']) return 'Please enter a valid email';
        break;
      case 'password':
        if (control.errors['required']) return 'Password is required';
        if (control.errors['minlength']) return 'Password must be at least 6 characters';
        break;
    }
    return '';
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach((key) => {
        this.loginForm.get(key)?.markAsTouched();
      });
      return;
    }

    const { email, password } = this.loginForm.value;
    if (!email || !password) return;

    this.loadingService.show();
    this.authService
      .login({ email, password })
      .pipe(
        tap((res) => {
          if (res.data?.token) {
            localStorage.setItem('authToken', res.data.token);
            if (res.data.userId) {
              this.store.dispatch(loadUser());
              this.store
                .select(selectUser)
                .pipe(
                  filter((user) => !!user),
                  take(1),
                )
                .subscribe(() => {
                  this.router.navigate(['']);
                });
            }
          }
        }),
        finalize(() => {
          this.loadingService.hide();
        }),
      )
      .subscribe();
  }

  onClickRegister() {
    this.router.navigate(['register']);
  }

  onClickForgetPassword() {
    this.router.navigate(['forget-password']);
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
