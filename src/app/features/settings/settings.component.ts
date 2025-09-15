import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  private router = inject(Router);
  private http = inject(HttpClient);

  logoutLoading = false;

  logout() {
    this.logoutLoading = true;
    this.http
      .post<{ success: boolean; message: string }>('/api/auth/logout', {})
      .pipe(finalize(() => (this.logoutLoading = false)))
      .subscribe({
        next: (res) => {
          if (res?.success) {
            alert(res.message);
            localStorage.removeItem('authToken');
            this.router.navigate(['/login']);
          } else {
            alert('logout failed, please try again.');
          }
        },
        error: (err) => {
          console.error('Logout error:', err);
          alert('An error occurred during logout. Please try again.');
        },
      });
  }
}
