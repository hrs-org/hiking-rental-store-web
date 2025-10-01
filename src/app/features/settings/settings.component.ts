import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Store } from '@ngrx/store';
import { selectUser } from '../../store/user/user.selector';

@Component({
  selector: 'app-settings',
  imports: [MatButtonModule, MatCardModule, CommonModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: true,
})
export class SettingsComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private store = inject(Store);

  user$ = this.store.select(selectUser);

  userName = '';
  userEmail = '';
  userRole = '';

  ngOnInit(): void {
    this.user$.subscribe((user) => {
      if (user) {
        this.userName = `${user.firstName} ${user.lastName}`;
        this.userEmail = user.email;
        this.userRole = user.role;
      }
    });
  }

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
