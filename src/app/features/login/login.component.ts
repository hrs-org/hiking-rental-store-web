import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { take, tap } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { Store } from '@ngrx/store';
import { loadUser } from '../../store/user/user.actions';
import { MatIconModule } from '@angular/material/icon';
import { selectUser } from '../../store/user/user.selector';

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
  private router = inject(Router);
  private store = inject(Store);

  hidePassword = true;
  isLoading = false;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  private setLoadingState(loading: boolean) {
    this.isLoading = loading;

    if (loading) {
      this.loginForm.disable();
    } else {
      this.loginForm.enable();
    }
  }
  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      if (!email || !password) return;
      if (this.isLoading) return;

      this.setLoadingState(true);

      this.authService
        .login({ email: email, password: password })
        .pipe(
          tap((res) => {
            if (res.data?.token) {
              localStorage.setItem('authToken', res.data.token);
              if (res.data.userId) {
                this.store.dispatch(loadUser());
                this.store
                  .select(selectUser)
                  .pipe(take(1))
                  .subscribe((user) => {
                    if (user) {
                      this.router.navigate(['']);
                    }
                  });
              }
            }
          }),
        )
        .subscribe(() => {
          this.setLoadingState(false);
        });
    }
  }

  onClickRegister() {
    if (!this.isLoading) {
      this.router.navigate(['register']);
    }
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !this.isLoading) {
      this.onSubmit();
    }
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
