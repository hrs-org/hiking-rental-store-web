import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { Store } from '@ngrx/store';
import { loadUser } from '../../store/user/user.actions';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private store = inject(Store);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      if (!email || !password) return;

      this.authService
        .login({ email: email, password: password })
        .pipe(
          tap((res) => {
            if (res.data?.token) {
              localStorage.setItem('authToken', res.data.token);
              if (res.data.userId) {
                this.store.dispatch(loadUser({ userId: res.data.userId }));
              }
              this.router.navigate(['']);
            } else {
              console.error('Token not found in response');
            }
          }),
        )
        .subscribe();
    }
  }

  onClickRegister() {
    this.router.navigate(['register']);
  }
}
