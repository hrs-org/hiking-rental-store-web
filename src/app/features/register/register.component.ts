import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { InfoBottomSheetComponent } from '../../shared/components/info-bottom-sheet/info-bottom-sheet.component';

@Component({
  selector: 'app-register',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private userService = inject(UserService);
  private bottomSheet = inject(MatBottomSheet);
  private router = inject(Router);

  registerForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', Validators.required),
  });

  private openInfoSheet(title: string, description: string, callback?: () => void) {
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

  onSubmit() {
    if (!this.registerForm.valid) {
      this.registerForm.markAsDirty();
      this.registerForm.markAsTouched();
      return;
    }

    const { password, confirmPassword, firstName, lastName, email } = this.registerForm.value;
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      this.openInfoSheet(
        'Incomplete Form',
        'Please fill out all required fields before submitting the form.',
      );
      return;
    }
    if (password !== confirmPassword) {
      this.openInfoSheet(
        'Password Mismatch',
        'The passwords you entered do not match. Please try again.',
      );
      return;
    }
    this.userService.register({ firstName, lastName, email, password }).subscribe(() => {
      this.openInfoSheet(
        'Registration Successful',
        'You can now log in with your credentials.',
        () => this.navigateToLogin(),
      );
    });
  }

  navigateToLogin() {
    this.router.navigate(['login']);
  }
}
