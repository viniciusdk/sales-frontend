import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast {{ toast.type }}" role="alert">
          <span class="toast-icon">
            @switch (toast.type) {
              @case ('success') { ✓ }
              @case ('error')   { ✕ }
              @case ('warning') { ⚠ }
              @default          { ℹ }
            }
          </span>
          <span>{{ toast.message }}</span>
          <button class="toast-close" (click)="toastService.remove(toast.id)" aria-label="Fechar">×</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-icon { font-weight: 700; min-width: 18px; text-align: center; }
    .toast-close {
      margin-left: auto; background: none; border: none; cursor: pointer;
      font-size: 1.2rem; color: inherit; opacity: 0.6; padding: 0 4px;
    }
    .toast-close:hover { opacity: 1; }
  `],
})
export class ToastComponent {
  protected readonly toastService = inject(ToastService);
}
