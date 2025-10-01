import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';
import { EmailVerificationRequest } from '../../core/models/auth/email-verification-request';
import { ApiResponse } from '../../core/models/api-response';
import { EmailVerificationResponse } from '../../core/models/auth/email-verification-response';

type VerificationStatus = 'success' | 'expired' | 'failed' | 'verifying';

@Component({
  selector: 'app-email-verification-result',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './email-verification-result.component.html',
  styleUrl: './email-verification-result.component.scss',
})
export class EmailVerificationResultComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  email = '';
  message = '';
  status: VerificationStatus = 'verifying';
  isLoading = false;

  verificationToken = '';

  ngOnInit() {
    this.email = this.route.snapshot.queryParams['email'] || '';
    this.verificationToken = this.route.snapshot.queryParams['token'] || '';

    if (!this.email || !this.verificationToken) {
      this.status = 'failed';
      this.message = 'Invalid verification link. Please try again.';
    } else {
      this.verifyEmail(this.email, this.verificationToken);
    }
  }

  private verifyEmail(email: string, token: string): void {
    this.isLoading = true;
    this.status = 'verifying';

    const request: EmailVerificationRequest = {
      email: email,
      verificationToken: token,
    };

    this.authService.verifyEmail(request).subscribe({
      next: (response: ApiResponse<EmailVerificationResponse>) => {
        this.isLoading = false;
        if (response.data?.isVerified) {
          this.status = 'success';
          this.message = response.data.message || 'Email verified successfully!';
        } else {
          const message = response.data?.message || 'Email verification failed.';
          if (message.includes('expired') || message.includes('expiry')) {
            this.status = 'expired';
            this.message = message;
          } else {
            this.status = 'failed';
            this.message = message;
          }
        }
      },
      error: (error: unknown) => {
        this.isLoading = false;
        this.status = 'failed';
        this.message = 'Email verification failed. Please try again.';
        console.error('Email verification error:', error);
      },
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  resendVerificationEmail() {
    if (!this.email) {
      this.status = 'failed';
      this.message = 'Email address not found. Please try registering again.';
      return;
    }

    this.isLoading = true;

    this.authService.resendVerificationEmail({ email: this.email }).subscribe({
      next: (response: ApiResponse<boolean>) => {
        this.isLoading = false;
        if (response.data) {
          // 仍保持 expired 状态，但更新消息表明邮件已发送
          this.message = 'A new verification email has been sent. Please check your inbox.';
        } else {
          this.status = 'failed';
          this.message = response.message || 'Failed to send verification email. Please try again.';
        }
      },
      error: (error: unknown) => {
        this.isLoading = false;
        this.status = 'failed';
        this.message = 'Error sending verification email. Please try again.';
        console.error('Error sending verification email:', error);
      },
    });
  }

  handlePrimaryButtonClick() {
    switch (this.status) {
      case 'success':
        this.goToLogin();
        break;
      case 'expired':
        this.resendVerificationEmail();
        break;
      case 'failed':
        this.goToRegister();
        break;
      default:
        this.goToLogin();
        break;
    }
  }

  handleSecondaryButtonClick() {
    if (this.getStatusConfig().secondaryButton) {
      this.goToRegister();
    }
  }

  getStatusConfig() {
    switch (this.status) {
      case 'verifying':
        return {
          icon: 'refresh',
          title: 'Verifying Email...',
          colorClass: 'status-verifying',
          primaryButton: {
            text: 'Verifying...',
            color: 'primary',
          },
          secondaryButton: null,
        };
      case 'success':
        return {
          icon: 'check_circle',
          title: 'Email Verified Successfully!',
          colorClass: 'status-success',
          primaryButton: {
            text: 'Go to Login',
            color: 'primary',
          },
          secondaryButton: null,
        };
      case 'expired':
        return {
          icon: 'schedule',
          title: 'Verification Link Expired',
          colorClass: 'status-expired',
          primaryButton: {
            text: 'Resend Verification Email',
            color: 'accent',
          },
          secondaryButton: {
            text: 'Back to Register',
            color: 'primary',
          },
        };
      case 'failed':
        return {
          icon: 'error',
          title: 'Email Verification Failed',
          colorClass: 'status-failed',
          primaryButton: {
            text: 'Back to Register',
            color: 'primary',
          },
          secondaryButton: null,
        };
      default:
        return {
          icon: 'help',
          title: 'Unknown Status',
          colorClass: 'status-unknown',
          primaryButton: {
            text: 'Go to Login',
            color: 'primary',
          },
          secondaryButton: null,
        };
    }
  }
}
