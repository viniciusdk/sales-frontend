import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private router = inject(Router);
  private toast  = inject(ToastService);

  loading   = signal(false);
  showPwd   = signal(false);
  submitted = signal(false);

  readonly petals = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    left: 6 + Math.random() * 88,
    delay: Math.random() * 10,
    dur: 7 + Math.random() * 9,
    size: 7 + Math.random() * 13,
    rot: Math.random() * 360,
    color: ['#E880BC','#D068A8','#C058A0','#F0B0D8','#B84890','#F8D0EC','#9B4DB3'][i % 7],
  }));

  form = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  showError(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!ctrl && ctrl.invalid && (ctrl.touched || this.submitted());
  }

  submit(): void {
    this.submitted.set(true);
    if (this.form.invalid) return;
    this.loading.set(true);
    const { email, password } = this.form.value;
    this.auth.login({ email: email!, password: password! }).subscribe({
      next:     () => { this.toast.success('Bem-vinda à Valdete Modas!'); this.router.navigate(['/dashboard']); },
      error:    () => { this.toast.error('E-mail ou senha inválidos.'); this.loading.set(false); },
      complete: () => this.loading.set(false),
    });
  }
}
