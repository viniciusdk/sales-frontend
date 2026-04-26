import { Component, inject } from '@angular/core';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-loading-spinner',
  template: `
    @if (loadingService.loading()) {
      <div class="spinner-overlay" role="status" aria-label="Carregando">
        <div class="spinner"></div>
      </div>
    }
  `,
})
export class LoadingSpinnerComponent {
  protected readonly loadingService = inject(LoadingService);
}
