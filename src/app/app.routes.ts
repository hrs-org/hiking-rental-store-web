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
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'employees-management',
    loadComponent: () =>
      import('./features/employees-management/employees-management.component').then(
        (m) => m.em_managementPageComponent,
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
