import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersFacade } from '../../facades/users.facade';
import { AppUser } from '../../../../shared/models/user.model';

type ModalMode = 'create' | 'edit' | null;

@Component({
  selector: 'app-users-page',
  imports: [ReactiveFormsModule],
  template: `
    <div class="animate-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">Usuários</h1>
          <p class="page-subtitle">{{ facade.users().length }} usuário(s) cadastrado(s)</p>
        </div>
        <button class="btn btn-primary" (click)="openCreate()">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
          Novo Usuário
        </button>
      </div>

      <div class="card animate-in animate-in-delay-1">
        @if (facade.users().length === 0) {
          <div class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
            <p>Nenhum usuário cadastrado</p>
            <button class="btn btn-outline btn-sm" (click)="openCreate()">Criar usuário</button>
          </div>
        } @else {
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Perfil</th>
                  <th>Status</th>
                  <th>Criado em</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                @for (u of facade.users(); track u.id) {
                  <tr>
                    <td>
                      <div class="user-cell">
                        <div class="user-avatar-sm">{{ u.name.charAt(0).toUpperCase() }}</div>
                        <strong>{{ u.name }}</strong>
                      </div>
                    </td>
                    <td class="text-muted">{{ u.email }}</td>
                    <td>
                      <span class="badge" [class]="u.role === 'admin' ? 'badge-purple' : 'badge-blue'">
                        {{ u.role === 'admin' ? 'Admin' : 'Vendedor' }}
                      </span>
                    </td>
                    <td>
                      <button class="toggle-btn" [class.active]="u.active" (click)="facade.toggleActive(u.id)" [title]="u.active ? 'Desativar' : 'Ativar'">
                        <span class="toggle-knob"></span>
                      </button>
                    </td>
                    <td class="text-muted date-cell">{{ formatDate(u.createdAt) }}</td>
                    <td>
                      <div class="action-btns">
                        <button class="btn btn-ghost btn-sm btn-icon" (click)="openEdit(u)" title="Editar">
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                        </button>
                        <button class="btn btn-ghost btn-sm btn-icon btn-danger" (click)="confirmDelete(u)" title="Excluir">
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>

    <!-- Create / Edit modal -->
    @if (modalMode() !== null) {
      <div class="modal-overlay" (click)="closeModal()">
        <div class="modal-box" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ modalMode() === 'create' ? 'Novo Usuário' : 'Editar Usuário' }}</h3>
            <button class="modal-close" (click)="closeModal()">×</button>
          </div>
          <form [formGroup]="form" (ngSubmit)="submitForm()" novalidate class="modal-body">
            <div class="form-group">
              <label class="form-label" for="uname">Nome <span class="req">*</span></label>
              <input id="uname" type="text" class="form-control" [class.error]="showErr('name')" formControlName="name" placeholder="Nome completo"/>
              @if (showErr('name')) { <span class="form-error">Campo obrigatório</span> }
            </div>
            <div class="form-group">
              <label class="form-label" for="uemail">E-mail <span class="req">*</span></label>
              <input id="uemail" type="email" class="form-control" [class.error]="showErr('email')" formControlName="email" placeholder="email@exemplo.com"/>
              @if (showErr('email')) { <span class="form-error">E-mail inválido</span> }
            </div>
            <div class="fg-2col">
              <div class="form-group">
                <label class="form-label" for="urole">Perfil <span class="req">*</span></label>
                <select id="urole" class="form-control" formControlName="role">
                  <option value="seller">Vendedor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Status</label>
                <div style="display: flex; align-items: center; gap: 10px; padding-top: 6px;">
                  <button type="button" class="toggle-btn" [class.active]="form.get('active')?.value" (click)="toggleFormActive()">
                    <span class="toggle-knob"></span>
                  </button>
                  <span style="font-size: 0.82rem; color: var(--color-text-muted);">
                    {{ form.get('active')?.value ? 'Ativo' : 'Inativo' }}
                  </span>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-ghost" (click)="closeModal()">Cancelar</button>
              <button type="submit" class="btn btn-primary" [disabled]="facade.submitting()">
                @if (facade.submitting()) {
                  <span class="btn-spinner"></span> Salvando...
                } @else {
                  {{ modalMode() === 'create' ? 'Criar Usuário' : 'Salvar' }}
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    }

    <!-- Delete confirmation modal -->
    @if (deleteTarget()) {
      <div class="modal-overlay" (click)="deleteTarget.set(null)">
        <div class="modal-box modal-box-sm" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Confirmar exclusão</h3>
            <button class="modal-close" (click)="deleteTarget.set(null)">×</button>
          </div>
          <div class="modal-body">
            <p style="font-size: 0.9rem; color: var(--color-text-muted);">
              Tem certeza que deseja remover <strong>{{ deleteTarget()!.name }}</strong>?
              Esta ação não pode ser desfeita.
            </p>
            <div class="modal-footer">
              <button class="btn btn-ghost" (click)="deleteTarget.set(null)">Cancelar</button>
              <button class="btn btn-danger" (click)="doDelete()">Excluir</button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .user-cell { display: flex; align-items: center; gap: 10px; }
    .user-avatar-sm {
      width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
      background: linear-gradient(135deg, #D8C0F0, #B060C8);
      color: #fff; font-size: 0.75rem; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
    }
    .date-cell { font-size: 0.82rem; white-space: nowrap; }
    .action-btns { display: flex; gap: 4px; }
    .btn-danger svg { color: var(--color-error); }

    .badge-blue { background: #E8F0FF; color: #2856A8; }

    /* Toggle switch */
    .toggle-btn {
      width: 38px; height: 22px; border-radius: 11px;
      background: #D8D0E0; border: none; cursor: pointer;
      position: relative; transition: background 0.2s;
      flex-shrink: 0; padding: 0;
    }
    .toggle-btn.active { background: #7B2D8B; }
    .toggle-knob {
      position: absolute; top: 3px; left: 3px;
      width: 16px; height: 16px; border-radius: 50%;
      background: #fff; transition: left 0.2s;
      box-shadow: 0 1px 4px rgba(0,0,0,0.2);
      display: block;
    }
    .toggle-btn.active .toggle-knob { left: 19px; }

    /* Modal */
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(45,27,53,0.45);
      display: flex; align-items: center; justify-content: center;
      z-index: 200; padding: 20px;
    }
    .modal-box {
      background: var(--color-bg-card); border-radius: 18px;
      width: 100%; max-width: 460px;
      box-shadow: 0 20px 60px rgba(74,24,88,0.22);
      overflow: hidden;
    }
    .modal-box-sm { max-width: 380px; }
    .modal-header {
      padding: 18px 24px 16px;
      border-bottom: 1px solid #F0E8F8;
      display: flex; justify-content: space-between; align-items: center;
      background: #FBF5FF;
    }
    .modal-header h3 {
      font-family: var(--font-display); font-size: 1.05rem;
      color: var(--color-primary-dark); margin: 0;
    }
    .modal-close {
      background: none; border: none; cursor: pointer;
      font-size: 1.4rem; color: var(--color-text-muted); line-height: 1;
      padding: 0 4px;
    }
    .modal-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 14px; }
    .modal-footer {
      display: flex; justify-content: flex-end; gap: 10px;
      padding-top: 8px; margin-top: 4px;
    }

    .fg-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 11px; }
    .req { color: var(--color-error); margin-left: 2px; }

    .btn-spinner {
      width: 13px; height: 13px;
      border: 2px solid rgba(255,255,255,0.4);
      border-top-color: #fff; border-radius: 50%;
      animation: spin 0.7s linear infinite;
      display: inline-block;
    }

    .btn-danger { background: #C62828; color: #fff; }
    .btn-danger:hover { background: #B71C1C; }
  `],
})
export class UsersPageComponent implements OnInit {
  protected readonly facade = inject(UsersFacade);
  private fb = inject(FormBuilder);

  modalMode   = signal<ModalMode>(null);
  editingId   = signal<string | null>(null);
  deleteTarget = signal<AppUser | null>(null);
  formSubmitted = signal(false);

  form = this.fb.group({
    name:   ['', Validators.required],
    email:  ['', [Validators.required, Validators.email]],
    role:   ['seller' as 'admin' | 'seller'],
    active: [true],
  });

  ngOnInit(): void { this.facade.loadAll(); }

  openCreate(): void {
    this.form.reset({ name: '', email: '', role: 'seller', active: true });
    this.editingId.set(null);
    this.formSubmitted.set(false);
    this.modalMode.set('create');
  }

  openEdit(u: AppUser): void {
    this.form.patchValue({ name: u.name, email: u.email, role: u.role, active: u.active });
    this.editingId.set(u.id);
    this.formSubmitted.set(false);
    this.modalMode.set('edit');
  }

  closeModal(): void { this.modalMode.set(null); }

  toggleFormActive(): void {
    const ctrl = this.form.get('active');
    ctrl?.setValue(!ctrl.value);
  }

  confirmDelete(u: AppUser): void { this.deleteTarget.set(u); }

  doDelete(): void {
    const t = this.deleteTarget();
    if (t) { this.facade.delete(t.id); }
    this.deleteTarget.set(null);
  }

  showErr(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!ctrl && ctrl.invalid && (ctrl.touched || this.formSubmitted());
  }

  submitForm(): void {
    this.formSubmitted.set(true);
    if (this.form.invalid) return;
    const val = this.form.value as { name: string; email: string; role: 'admin' | 'seller'; active: boolean };
    const id = this.editingId();
    if (id) {
      this.facade.update(id, val, () => this.closeModal());
    } else {
      this.facade.create(val, () => this.closeModal());
    }
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('pt-BR');
  }
}
