import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import {
  SettingsOption,
  SettingsOptionComponent,
} from '../../shared/components/settings-option/settings-option.component';
import { selectUser } from '../../store/user/user.selector';

const settingItems: SettingsOption[] = [
  {
    title: '',
    titleUppercase: true,
    desc: '',
    icon: 'person',
    iconColor: 'blue',
    showChevron: true,
    onClick: () => {
      return;
    },
  },
  {
    title: 'Logout',
    desc: 'We will miss you!',
    icon: 'logout',
    iconColor: 'red',
    onClick: () => {
      return;
    },
  },
];

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

          this.settingItems[0].title = `${user.firstName} ${user.lastName}`;
          this.settingItems[0].desc = user.role;
          this.settingItems[0].onClick = () => {
            this.router.navigate(['/profile']);
          };
        }),
      )
      .subscribe();

    this.settingItems[1].onClick = () => {
      this.logout();
    };
  }

  goToEmployeesManagement() {
    this.router.navigate(['employees-management']);
  }

  logout() {
    this.authService.logout().subscribe(() => {
      localStorage.removeItem('authToken');
      this.router.navigate(['/login']);
    });
  }
}
