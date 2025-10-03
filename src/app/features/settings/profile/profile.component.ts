import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PwaHeaderComponent } from '../../../shared/components/pwa-header/pwa-header.component';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngrx/store';
import { selectUser } from '../../../store/user/user.selector';
import { AsyncPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordDialogComponent } from './change-password-dialog/change-password-dialog.component';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  readonly dialog = inject(MatDialog);

  user$ = this.store.select(selectUser);

  openDialog(): void {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      data: {},
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.authService.changePassword(result).subscribe({
          next: () => {
            this._snackBar.open('Password changed successfully', 'Close', {
              duration: 2500,
            });
          },
        });
      }
    });
  }
}
