import { Routes } from '@angular/router';
import { guestGuard } from '../../core/guards/auth.guard';

export const loginRoutes: Routes = [
  {
    path: '',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./containers/login-page/login-page.component').then(m => m.LoginPageComponent),
  },
];
