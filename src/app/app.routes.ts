import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { PwaLayoutComponent } from './core/layout/pwa-layout/pwa-layout.component';
import { RoleGuard } from './core/guards/role.guard';
import { UserRole } from './core/models/user/user';

export const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: PwaLayoutComponent,
        children: [
          {
            path: '',
            redirectTo: 'catalog',
            pathMatch: 'full',
          },
          {
            path: 'catalog',
            loadComponent: () =>
              import('./features/catalog/catalog.component').then((m) => m.CatalogComponent),
          },
          {
            path: 'booking',
            loadComponent: () =>
              import('./features/booking/booking.component').then((m) => m.BookingComponent),
            canActivate: [RoleGuard],
            data: { roles: [UserRole.Admin, UserRole.Manager, UserRole.Employee] },
          },
          {
            path: 'return',
            loadComponent: () =>
              import('./features/return/return.component').then((m) => m.ReturnComponent),
            canActivate: [RoleGuard],
            data: { roles: [UserRole.Admin, UserRole.Manager, UserRole.Employee] },
          },
          {
            path: 'settings',
            loadComponent: () =>
              import('./features/settings/settings.component').then((m) => m.SettingsComponent),
          },
        ],
      },
      {
        path: 'checkout',
        loadComponent: () =>
          import('./features/catalog/checkout/checkout.component').then((m) => m.CheckoutComponent),
      },
      {
        path: 'payment',
        loadComponent: () =>
          import('./features/catalog/payment/payment.component').then((m) => m.PaymentComponent),
      },
      {
        path: 'payment/verify',
        loadComponent: () =>
          import('./features/catalog/payment/verify/verify.component').then(
            (m) => m.VerifyComponent,
          ),
      },
      {
        path: 'booking/:id',
        loadComponent: () =>
          import('./features/booking/booking-details/booking-details.component').then(
            (m) => m.BookingDetailsComponent,
          ),
        canActivate: [RoleGuard],
        data: { roles: [UserRole.Admin, UserRole.Manager, UserRole.Employee] },
      },
      {
        path: 'return/:id',
        loadComponent: () =>
          import('./features/return/return-details/return-details.component').then(
            (m) => m.ReturnDetailsComponent,
          ),
        canActivate: [RoleGuard],
        data: { roles: [UserRole.Admin, UserRole.Manager, UserRole.Employee] },
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/settings/profile/profile.component').then((m) => m.ProfileComponent),
      },
      {
        path: 'settings/store-profile',
        loadComponent: () =>
          import('./features/settings/store-profile/store-profile.component').then(
            (m) => m.StoreProfileComponent,
          ),
      },
      {
        path: 'employees-management',
        loadComponent: () =>
          import('./features/settings/employees-management/employees-management.component').then(
            (m) => m.EmployeeManagementPageComponent,
          ),
        canActivate: [RoleGuard],
        data: { roles: [UserRole.Admin, UserRole.Manager] },
      },
      {
        path: 'inventory-management',
        loadComponent: () =>
          import('./features/settings/inventory-management/inventory-management.component').then(
            (m) => m.InventoryManagementComponent,
          ),
        canActivate: [RoleGuard],
        data: { roles: [UserRole.Admin, UserRole.Manager] },
      },
      {
        path: 'add-edit-item',
        loadComponent: () =>
          import(
            './features/settings/inventory-management/add-edit-item/add-edit-item.component'
          ).then((m) => m.AddEditItemComponent),
        canActivate: [RoleGuard],
        data: { roles: [UserRole.Admin, UserRole.Manager] },
      },
      {
        path: 'add-edit-item/:id',
        loadComponent: () =>
          import(
            './features/settings/inventory-management/add-edit-item/add-edit-item.component'
          ).then((m) => m.AddEditItemComponent),
        canActivate: [RoleGuard],
        data: { roles: [UserRole.Admin, UserRole.Manager] },
      },
      {
        path: 'item-maintenance',
        loadComponent: () =>
          import('./features/settings/item-maintenance/item-maintenance.component').then(
            (m) => m.ItemMaintenanceComponent,
          ),
        canActivate: [RoleGuard],
        data: { roles: [UserRole.Admin, UserRole.Manager] },
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
    path: 'verify-email',
    loadComponent: () =>
      import('./features/email-verification-result/email-verification-result.component').then(
        (m) => m.EmailVerificationResultComponent,
      ),
  },
  {
    path: 'forget-password',
    loadComponent: () =>
      import('./features/forget-password/forget-password.component').then(
        (m) => m.ForgetPasswordComponent,
      ),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./features/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent,
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
