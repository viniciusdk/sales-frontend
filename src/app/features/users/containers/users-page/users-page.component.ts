import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersFacade } from '../../facades/users.facade';
import { AppUser } from '../../../../shared/models/user.model';

type ModalMode = 'create' | 'edit' | null;

@Component({
  selector: 'app-users-page',
  imports: [ReactiveFormsModule],
  templateUrl: './users-page.component.html',
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
