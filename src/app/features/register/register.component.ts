import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-register',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private userService = inject(UserService);
  private router = inject(Router);
  registerForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    if (this.registerForm.valid) {
      const { password, confirmPassword, firstName, lastName, email } = this.registerForm.value;
      if (!firstName || !lastName || !email || !password || !confirmPassword) {
        alert('Please fill all the fields');
        return;
      }
      if (password !== confirmPassword) {
        alert('Password do not match');
        return;
      }
      this.userService
        .register({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
        })
        .subscribe({
          next: () => {
            alert('Registration successful! Please login.');
            this.router.navigate(['login']);
          },
          error: (err) => {
            console.error('Registration failed', err);
            alert('Registration failed. Please try again.');
          },
        });
    }
  }

  // Navigate back to login page
  goBack() {
    this.router.navigate(['login']);
  }
}
