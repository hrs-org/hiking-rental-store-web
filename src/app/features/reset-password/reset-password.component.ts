import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AuthService } from '../../core/services/auth.service';
import { ResetPasswordRequest } from '../../core/models/auth/reset-password-request';
import { InfoBottomSheetComponent } from '../../shared/components/info-bottom-sheet/info-bottom-sheet.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private bottomSheet = inject(MatBottomSheet);

  resetPasswordForm!: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = false;
  email = '';
  token = '';

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap.get('email') || '';
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    if (!this.email || !this.token) {
      this.bottomSheet.open(InfoBottomSheetComponent, {
        data: {
          title: 'Error',
          description: 'Invalid or missing reset link',
          isConfirm: false,
          confirmButtonText: 'Ok',
        },
      });
      this.router.navigate(['/forgot-password']);
      return;
    }

    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmNewPassword: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.resetPasswordForm.invalid) {
      return;
    }

    this.isLoading = true;
    const request: ResetPasswordRequest = {
      email: this.email,
      token: this.token,
      newPassword: this.resetPasswordForm.value.newPassword!,
      confirmNewPassword: this.resetPasswordForm.value.confirmNewPassword!,
    };

    this.authService.resetPassword(request).subscribe({
      next: (res) => {
        this.isLoading = false;
        const message = res?.message || 'Password reset successful! Please login.';

        this.bottomSheet.open(InfoBottomSheetComponent, {
          data: {
            title: 'Success',
            description: message,
            isConfirm: false,
            confirmButtonText: 'Ok',
          },
        });

        history.replaceState(null, '', this.router.url.split('?')[0]);
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        const message =
          error?.error?.message ||
          error?.error?.errors?.[0] ||
          'Failed to reset password. Please try again.';
        this.bottomSheet.open(InfoBottomSheetComponent, {
          data: {
            title: 'Error',
            description: message,
            isConfirm: false,
            confirmButtonText: 'Ok',
          },
        });
      },
    });
  }

  togglePasswordVisibility(field: 'password' | 'confirm'): void {
    if (field === 'password') {
      this.hidePassword = !this.hidePassword;
    } else {
      this.hideConfirmPassword = !this.hideConfirmPassword;
    }
  }
}
