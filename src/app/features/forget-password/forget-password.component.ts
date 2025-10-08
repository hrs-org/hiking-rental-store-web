import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AuthService } from '../../core/services/auth.service';
import { ForgotPasswordRequest } from '../../core/models/auth/forgot-password-request';
import { InfoBottomSheetComponent } from '../../shared/components/info-bottom-sheet/info-bottom-sheet.component';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
})
export class ForgetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private bottomSheet = inject(MatBottomSheet);

  forgetPasswordForm!: FormGroup;
  isLoading = false;

  ngOnInit(): void {
    this.forgetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.forgetPasswordForm.invalid) {
      return;
    }

    this.isLoading = true;
    const request: ForgotPasswordRequest = {
      email: this.forgetPasswordForm.value.email!,
    };

    this.authService.forgotPassword(request).subscribe({
      next: (res) => {
        this.isLoading = false;
        const message =
          res.data?.message || 'If the email is registered, a password reset link will be sent.';
        const title = res.data?.isSuccess ? 'Success' : 'Failed';
        this.bottomSheet.open(InfoBottomSheetComponent, {
          data: {
            title: title,
            description: message,
            isConfirm: false,
            confirmButtonText: 'Ok',
          },
        });
        this.forgetPasswordForm.reset();
      },
      error: (error) => {
        this.isLoading = false;
        const message =
          error?.error?.message ||
          error?.error?.errors?.[0] ||
          'Failed to send reset email. Please try again.';
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
}
