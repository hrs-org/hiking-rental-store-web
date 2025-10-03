import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-change-password-dialog',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatIcon,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './change-password-dialog.component.html',
  styleUrl: './change-password-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ChangePasswordDialogComponent>);

  password: FormGroup = new FormGroup({
    currentPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required]),
    confirmNewPassword: new FormControl('', [Validators.required]),
  });

  hide = {
    current: true,
    new: true,
    confirm: true,
  };

  errorMessages = {
    current: signal(''),
    new: signal(''),
    confirm: signal(''),
  };

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.password.valid) {
      this.dialogRef.close(this.password.value);
    }
  }

  updateErrorMessages(controlName: 'currentPassword' | 'newPassword' | 'confirmNewPassword'): void {
    const control = this.password.get(controlName);
    const errorKey =
      controlName === 'currentPassword'
        ? 'current'
        : controlName === 'newPassword'
          ? 'new'
          : 'confirm';

    if (control?.hasError('required')) {
      this.errorMessages[errorKey].set('You must enter a value');
    } else {
      this.errorMessages[errorKey].set('');
    }
  }
}
