import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { InfoBottomSheetComponent } from '../../shared/components/info-bottom-sheet/info-bottom-sheet.component';
import { LoadingService } from '../../core/services/loading.service';
import { StoreService } from '../../core/services/store.service';
import { CommonModule } from '@angular/common';
import { switchMap, take } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  private readonly storeService = inject(StoreService);
  private readonly loadingService = inject(LoadingService);
  private readonly auth0 = inject(Auth0Service);
  private readonly bottomSheet = inject(MatBottomSheet);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  submitted = false;
  firstName = '';
  lastName = '';
  auth0UserId = '';
  email = '';

  storeForm = new FormGroup({
    storeName: new FormControl('', Validators.required),
    storeDescription: new FormControl('', Validators.required),
    storeAddress: new FormControl('', Validators.required),
    storePhoneNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(String.raw`^\+?[0-9\- ]{7,15}$`),
    ]),
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.firstName = params['firstName'] ?? '';
      this.lastName = params['lastName'] ?? '';

      if (!this.firstName || !this.lastName) {
        this.openInfoSheet(
          'Missing Information',
          'Please provide your first and last name before continuing as a store.',
          () => this.router.navigate(['/register-choice']),
        );
      }
    });

    this.auth0.user$.pipe(take(1)).subscribe((user) => {
      this.auth0UserId = user?.sub ?? '';
      this.email = user?.email ?? '';

      if (!this.auth0UserId || !this.email) {
        this.redirectToAuth0Signup();
      }
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

  hasError(controlName: string): boolean {
    const control = this.storeForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched || this.submitted));
  }

  getErrorMessage(controlName: string): string {
    const control = this.storeForm.get(controlName);
    if (!control?.errors) return '';

    const errors = control.errors;

    switch (controlName) {
      case 'storeName':
        if (errors['required']) return 'Store name is required';
        break;

      case 'storeDescription':
        if (errors['required']) return 'Store description is required';
        break;

      case 'storeAddress':
        if (errors['required']) return 'Store address is required';
        break;

      case 'storePhoneNumber':
        if (errors['required']) return 'Store phone number is required';
        if (errors['pattern']) return 'Please enter a valid phone number';
        break;
    }

    return '';
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.storeForm.invalid) {
      this.markAllFieldsAsTouched();
      return;
    }

    const { storeName, storeAddress, storeDescription, storePhoneNumber } = this.storeForm.value;

    this.loadingService.show();
    this.auth0
      .getAccessTokenSilently({
        authorizationParams: {
          audience: environment.auth0.audience,
          scope: 'openid profile email offline_access',
        },
      })
      .pipe(
        take(1),
        switchMap(() =>
          this.storeService.registerStore({
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            name: storeName!,
            address: storeAddress!,
            description: storeDescription!,
            phoneNumber: storePhoneNumber!,
          }),
        ),
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
          this.openInfoSheet('Registration Successful', 'Please log in to continue.', () => {
            this.router.navigate(['/']);
          });
        },
        error: () => this.loadingService.hide(),
        complete: () => this.loadingService.hide(),
      });
  }

  private markAllFieldsAsTouched() {
    Object.keys(this.storeForm.controls).forEach((key) => {
      this.storeForm.get(key)?.markAsTouched();
    });
  }

  handleBack(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/register-choice']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/']);
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
        error: () => this.navigateToLogin(),
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
        error: () => this.navigateToLogin(),
      });
  }
}
