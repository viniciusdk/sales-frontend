import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const usersRoutes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./containers/users-page/users-page.component').then(m => m.UsersPageComponent),
  },
];
