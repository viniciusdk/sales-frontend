import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const salesRoutes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./containers/sales-list-page/sales-list-page.component').then(m => m.SalesListPageComponent),
  },
  {
    path: 'new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./containers/sales-page/sales-page.component').then(m => m.SalesPageComponent),
  },
];
