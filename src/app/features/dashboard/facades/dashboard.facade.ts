import { Injectable, inject, signal } from '@angular/core';
import { DashboardStats } from '../../../shared/models/sale.model';
import { DashboardService } from '../services/dashboard.service';
import { LoadingService } from '../../../core/services/loading.service';
import { ToastService } from '../../../core/services/toast.service';

@Injectable({ providedIn: 'root' })
export class DashboardFacade {
  private svc     = inject(DashboardService);
  private loading = inject(LoadingService);
  private toast   = inject(ToastService);

  readonly stats = signal<DashboardStats | null>(null);

  load(): void {
    this.loading.show();
    this.svc.getStats().subscribe({
      next:     s => this.stats.set(s),
      error:    () => this.toast.error('Erro ao carregar dashboard.'),
      complete: () => this.loading.hide(),
    });
  }
}
