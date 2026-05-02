import { Injectable, inject, signal } from '@angular/core';
import { AppUser } from '../../../shared/models/user.model';
import { UsersService, UserForm } from '../services/users.service';
import { ToastService } from '../../../core/services/toast.service';
import { LoadingService } from '../../../core/services/loading.service';

@Injectable({ providedIn: 'root' })
export class UsersFacade {
  private svc     = inject(UsersService);
  private toast   = inject(ToastService);
  private loading = inject(LoadingService);

  readonly users      = signal<AppUser[]>([]);
  readonly submitting = signal(false);

  loadAll(): void {
    this.loading.show();
    this.svc.getAll().subscribe({
      next:     u => this.users.set(u),
      error:    () => this.toast.error('Erro ao carregar usuários.'),
      complete: () => this.loading.hide(),
    });
  }

  create(form: UserForm, onSuccess?: () => void): void {
    this.submitting.set(true);
    this.svc.create(form).subscribe({
      next: u => {
        this.users.update(list => [u, ...list]);
        this.toast.success('Usuário criado com sucesso!');
        onSuccess?.();
      },
      error:    () => this.toast.error('Erro ao criar usuário.'),
      complete: () => this.submitting.set(false),
    });
  }

  update(id: string, form: UserForm, onSuccess?: () => void): void {
    this.submitting.set(true);
    this.svc.update(id, form).subscribe({
      next: u => {
        this.users.update(list => list.map(x => x.id === id ? u : x));
        this.toast.success('Usuário atualizado!');
        onSuccess?.();
      },
      error:    () => this.toast.error('Erro ao atualizar usuário.'),
      complete: () => this.submitting.set(false),
    });
  }

  toggleActive(id: string): void {
    const user = this.users().find(u => u.id === id);
    if (!user) return;
    const form: UserForm = { name: user.name, email: user.email, role: user.role, active: !user.active };
    this.svc.update(id, form).subscribe({
      next: u => {
        this.users.update(list => list.map(x => x.id === id ? u : x));
        this.toast.success(u.active ? 'Usuário ativado.' : 'Usuário desativado.');
      },
      error: () => this.toast.error('Erro ao alterar status.'),
    });
  }

  delete(id: string): void {
    this.loading.show();
    this.svc.delete(id).subscribe({
      next: () => {
        this.users.update(list => list.filter(u => u.id !== id));
        this.toast.success('Usuário removido.');
      },
      error:    () => this.toast.error('Erro ao remover usuário.'),
      complete: () => this.loading.hide(),
    });
  }
}
