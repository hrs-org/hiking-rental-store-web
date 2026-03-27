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
            loadComponent: () =>
              import('./features/role-redirect/role-redirect.component').then(
                (m) => m.RoleRedirectComponent,
              ),
          },
          {
            path: 'stores',
            loadComponent: () =>
              import('./features/store-list/store-list.component').then(
                (m) => m.StoreListComponent,
              ),
          },
          {
            path: 'catalog/:storeId',
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
          import('./features/settings/inventory-management/add-edit-item/add-edit-item.component').then(
            (m) => m.AddEditItemComponent,
          ),
        canActivate: [RoleGuard],
        data: { roles: [UserRole.Admin, UserRole.Manager] },
      },
      {
        path: 'add-edit-item/:id',
        loadComponent: () =>
          import('./features/settings/inventory-management/add-edit-item/add-edit-item.component').then(
            (m) => m.AddEditItemComponent,
          ),
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
    path: 'register-choice',
    loadComponent: () =>
      import('./features/registration-choice/registration-choice.component').then(
        (m) => m.RegistrationChoiceComponent,
      ),
  },
  {
    path: 'register/store',
    loadComponent: () =>
      import('./features/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
