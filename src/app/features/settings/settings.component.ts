import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-settings',
  imports: [MatButtonModule, MatCardModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: true,
})
export class SettingsComponent {
  private router = inject(Router);
  private http = inject(HttpClient);

  userName = 'John Doe';
  userEmail = 'john.doe@example.com';
  userRole: 'admin' | 'user' = 'admin';
  get userInitials(): string {
    return this.userName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }
  goToEmployeesManagement() {
    this.router.navigate(['employees-management']);
  }

  logoutLoading = false;

  logout() {
    this.logoutLoading = true;
    this.http
      .post<{ success: boolean; message: string }>('/api/auth/logout', {})
      .pipe(finalize(() => (this.logoutLoading = false)))
      .subscribe({
        next: (res) => {
          if (res?.success) {
            localStorage.removeItem('authToken');
            this.router.navigate(['/login']);
          } else {
            alert('logout failed, please try again.');
          }
        },
      });
  }
}
