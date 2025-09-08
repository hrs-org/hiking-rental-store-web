import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then((m) => m.LoginComponent),
  },
  // {
  //   path: 'register',
  //   loadComponent: () => import('./features/register/register.component').then(m => m.RegisterComponent)
  // },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    children: [
      {
        path: 'overview',
        loadComponent: () =>
          import('./features/dashboard/store-page/store-page.component').then(
            (m) => m.StorePageComponent,
          ),
      },
    ],
  },
];
