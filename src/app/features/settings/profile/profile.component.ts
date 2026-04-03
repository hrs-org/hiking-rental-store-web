import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PwaHeaderComponent } from '../../../shared/components/pwa-header/pwa-header.component';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngrx/store';
import { selectUser } from '../../../state/user/user.selector';
import { AsyncPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs';

@Component({
  selector: 'app-profile',
  imports: [PwaHeaderComponent, MatCardModule, AsyncPipe, MatButton],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  private store = inject(Store);
  private authService = inject(AuthService);
  private _snackBar = inject(MatSnackBar);

  user$ = this.store.select(selectUser);
  canChangePassword$ = this.authService.canChangePasswordWithAuth0();

  changePassword(email: string): void {
    this.authService
      .requestAuth0PasswordChange(email)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this._snackBar.open('Please check your email to change your password', 'Close', {
            duration: 3000,
          });
        },
        error: () => {
          this._snackBar.open('Unable to start password change. Please try again.', 'Close', {
            duration: 3000,
          });
        },
      });
  }
}
