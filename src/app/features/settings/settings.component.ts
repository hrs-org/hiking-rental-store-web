import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import {
  Identifier,
  SettingsOptionComponent,
} from '../../shared/components/settings-option/settings-option.component';
import { selectUser } from '../../state/user/user.selector';
import { settingItems } from './settingItems';
import { User } from '../../core/models/user/user';

@Component({
  selector: 'app-settings',
  imports: [MatButtonModule, SettingsOptionComponent],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: true,
})
export class SettingsComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private store = inject(Store);

  user$ = this.store.select(selectUser);
  settingItems = settingItems;

  ngOnInit() {
    this.user$
      .pipe(
        tap((user) => {
          if (!user) {
            return;
          }

          this.generateSettings(user);
        }),
      )
      .subscribe();
  }

  logout() {
    this.authService.logout().subscribe(() => {
      localStorage.removeItem('authToken');
      this.router.navigate(['/login']);
    });
  }

  generateSettings(user: User) {
    // Profile
    this.settingItems.find((si) => si.identifier === Identifier.Profile)!.title =
      `${user.firstName} ${user.lastName}`;
    this.settingItems.find((si) => si.identifier === Identifier.Profile)!.desc = user.role;
    this.settingItems.find((si) => si.identifier === Identifier.Profile)!.onClick = () => {
      this.router.navigate(['/profile']);
    };

    // Employee Management
    if (user.role === 'Admin' || user.role === 'Manager') {
      this.settingItems.find((si) => si.identifier === Identifier.EmployeeManagement)!.onClick =
        () => {
          this.router.navigate(['/employees-management']);
        };
    } else {
      this.settingItems = this.settingItems.filter(
        (si) => si.identifier !== Identifier.EmployeeManagement,
      );
    }

    // Item Management
    if (user.role === 'Admin' || user.role === 'Manager') {
      this.settingItems.find((si) => si.identifier === Identifier.ItemManagement)!.onClick = () => {
        this.router.navigate(['/inventory-management']);
      };
      this.settingItems.find((si) => si.identifier === Identifier.ItemMaintenance)!.onClick =
        () => {
          this.router.navigate(['/item-maintenance']);
        };
    } else {
      this.settingItems = this.settingItems.filter(
        (si) =>
          si.identifier !== Identifier.ItemManagement &&
          si.identifier !== Identifier.ItemMaintenance,
      );
    }

    // Store Profile
    if (user.role === 'Admin' || user.role === 'Manager') {
      this.settingItems.find((si) => si.identifier === Identifier.StoreProfile)!.onClick = () => {
        this.router.navigate(['/settings/store-profile']);
      };
    } else {
      this.settingItems = this.settingItems.filter(
        (si) => si.identifier !== Identifier.StoreProfile,
      );
    }

    // Logout
    this.settingItems.find((si) => si.identifier === Identifier.Logout)!.onClick = () => {
      this.logout();
    };
  }
}
