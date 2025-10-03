import { Routes } from '@angular/router';
import { BaseLayoutComponent } from './core/layout/base-layout/base-layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { PwaLayoutComponent } from './core/layout/pwa-layout/pwa-layout.component';

const isMobile = window.matchMedia('(max-width: 768px)').matches;

export const routes: Routes = [
  {
    path: '',
    component: isMobile ? PwaLayoutComponent : BaseLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'store',
        pathMatch: 'full',
      },
      {
        path: 'store',
        loadComponent: () =>
          import('./features/store/store.component').then((m) => m.StorePageComponent),
      },
      {
        path: 'booking',
        loadComponent: () =>
          import('./features/booking/booking.component').then((m) => m.BookingComponent),
      },
      {
        path: 'return',
        loadComponent: () =>
          import('./features/return/return.component').then((m) => m.ReturnComponent),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/settings.component').then((m) => m.SettingsComponent),
      },
    ],
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/settings/profile/profile.component').then((m) => m.ProfileComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'inventory-management',
    loadComponent: () =>
      import('./features/settings/inventory-management/inventory-management.component').then(
        (m) => m.InventoryManagementComponent,
      ),
  },
  {
    path: 'add-edit-item',
    loadComponent: () =>
      import('./features/settings/inventory-management/add-edit-item/add-edit-item.component').then(
        (m) => m.AddEditItemComponent,
      ),
  },
  {
    path: 'add-edit-item/:id',
    loadComponent: () =>
      import('./features/settings/inventory-management/add-edit-item/add-edit-item.component').then(
        (m) => m.AddEditItemComponent,
      ),
  },
  {
    path: 'verify-email',
    loadComponent: () =>
      import('./features/email-verification-result/email-verification-result.component').then(
        (m) => m.EmailVerificationResultComponent,
      ),
  },
  {
    path: 'employees-management',
    loadComponent: () =>
      import('./features/employees-management/employees-management.component').then(
        (m) => m.EmployeeManagementPageComponent,
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
