import { Component, inject } from '@angular/core';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
})
export class LoadingSpinnerComponent {
  protected readonly loadingService = inject(LoadingService);
}
