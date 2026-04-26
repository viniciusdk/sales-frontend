import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const productsRoutes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./containers/products-list-page/products-list-page.component').then(m => m.ProductsListPageComponent),
  },
  {
    path: 'new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./containers/products-form-page/products-form-page.component').then(m => m.ProductsFormPageComponent),
  },
  {
    path: 'edit/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./containers/products-form-page/products-form-page.component').then(m => m.ProductsFormPageComponent),
  },
];
