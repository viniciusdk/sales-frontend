import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast.component';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent, LoadingSpinnerComponent],
  template: `
    <router-outlet />
    <app-toast />
    <app-loading-spinner />
  `,
})
export class App {}
