import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { InfoBottomSheetComponent } from '../../shared/components/info-bottom-sheet/info-bottom-sheet.component';
import { UserService } from '../../core/services/user.service';
import { LoadingService } from '../../core/services/loading.service';
import { switchMap, take } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-registration-choice',
  imports: [ReactiveFormsModule],
  templateUrl: './registration-choice.component.html',
  styleUrl: './registration-choice.component.scss',
})
export class RegistrationChoiceComponent {
  private readonly userService = inject(UserService);
  private readonly loadingService = inject(LoadingService);
  private readonly auth0 = inject(Auth0Service);
  private readonly bottomSheet = inject(MatBottomSheet);
  private readonly router = inject(Router);

  submitted = false;
  auth0UserId = '';
  email = '';

  constructor() {
    this.auth0.user$.pipe(take(1)).subscribe((user) => {
      this.auth0UserId = user?.sub ?? '';
      this.email = user?.email ?? '';

      // Pre-populate form with Auth0 data if available
      if (user?.given_name) {
        this.registrationChoiceForm.get('firstName')?.setValue(user.given_name);
      }
      if (user?.family_name) {
        this.registrationChoiceForm.get('lastName')?.setValue(user.family_name);
      }

      if (!this.auth0UserId || !this.email) {
        this.redirectToAuth0Signup();
      }
    });
  }

  registrationChoiceForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
  });

  hasError(controlName: string): boolean {
    const control = this.registrationChoiceForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched || this.submitted));
  }

  getErrorMessage(controlName: string): string {
    const control = this.registrationChoiceForm.get(controlName);
    if (!control?.errors) return '';

    if (controlName === 'firstName' && control.errors['required']) {
      return 'First name is required';
    }

    if (controlName === 'lastName' && control.errors['required']) {
      return 'Last name is required';
    }

    return '';
  }

  continueAsUser(): void {
    this.submitted = true;

    if (this.registrationChoiceForm.invalid) {
      this.markAllFieldsAsTouched();
      return;
    }

    const { firstName, lastName } = this.registrationChoiceForm.value;
    this.loadingService.show();

    this.userService
      .registerAsCustomer({
        email: this.email,
        firstName: firstName!,
        lastName: lastName!,
        auth0UserId: this.auth0UserId,
      })
      .pipe(
        take(1),
        switchMap(() =>
          this.auth0.getAccessTokenSilently({
            authorizationParams: {
              audience: environment.auth0.audience,
              scope: 'openid profile email offline_access',
            },
            cacheMode: 'off',
          }),
        ),
      )
      .subscribe({
        next: (token) => {
          localStorage.setItem('authToken', token);
          this.openInfoSheet('Registration Completed', 'Please log in to continue.', () => {
            this.router.navigate(['/']);
          });
        },
        error: () => this.loadingService.hide(),
        complete: () => this.loadingService.hide(),
      });
  }

  continueAsStore(): void {
    this.submitted = true;

    if (this.registrationChoiceForm.invalid) {
      this.markAllFieldsAsTouched();
      return;
    }

    const { firstName, lastName } = this.registrationChoiceForm.value;

    this.router.navigate(['/register/store'], {
      queryParams: {
        firstName,
        lastName,
      },
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

  private markAllFieldsAsTouched() {
    Object.keys(this.registrationChoiceForm.controls).forEach((key) => {
      this.registrationChoiceForm.get(key)?.markAsTouched();
    });
  }

  private redirectToAuth0Login(): void {
    localStorage.removeItem('authToken');

    this.auth0
      .loginWithRedirect({
        authorizationParams: {
          screen_hint: 'login',
          audience: environment.auth0.audience,
          scope: 'openid profile email offline_access',
          prompt: 'login',
        },
      })
      .subscribe({
        error: () => {
          void this.router.navigate(['/']);
        },
      });
  }

  private redirectToAuth0Signup(): void {
    this.auth0
      .loginWithRedirect({
        appState: {
          target: '/register-choice',
          flow: 'signup',
        },
        authorizationParams: {
          screen_hint: 'signup',
          redirect_uri: `${globalThis.location.origin}/register-choice`,
          audience: environment.auth0.audience,
          scope: 'openid profile email offline_access',
        },
      })
      .subscribe({
        error: () => {
          void this.router.navigate(['/']);
        },
      });
  }
}
