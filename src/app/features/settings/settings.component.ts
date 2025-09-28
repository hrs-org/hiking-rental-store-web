import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-settings',
  imports: [MatButtonModule, MatCardModule, CommonModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: true,
})
export class SettingsComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  userName = 'John Doe';
  userEmail = 'john.doe@example.com';
  userRole = 'admin';
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
    this.authService.logout().subscribe(() => {
      localStorage.removeItem('authToken');
      this.router.navigate(['/login']);
    });
  }
}
