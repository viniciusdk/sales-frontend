import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  template: `
    <div class="login-shell">
      <div class="bg-blob bg-blob-1"></div>
      <div class="bg-blob bg-blob-2"></div>
      <div class="bg-blob bg-blob-3"></div>

      <div class="login-card animate-in">

        <!-- ── Floral header ── -->
        <div class="card-header">

          <!-- Left botanical cluster -->
          <svg class="floral floral-left" viewBox="0 0 170 150" xmlns="http://www.w3.org/2000/svg">
            <!-- Large filled wave sweeping from top-left -->
            <path d="M0,0 L170,0 C148,4 122,2 100,12 C78,22 66,40 48,48 C32,55 14,52 6,64 C0,72 0,85 0,95 Z"
                  fill="white" opacity="0.22"/>
            <!-- Secondary wave for depth -->
            <path d="M0,0 C45,6 78,4 95,22 C112,40 104,62 88,72 C72,82 48,78 32,90 C18,100 10,118 0,128 Z"
                  fill="white" opacity="0.11"/>

            <!-- Main curving stem -->
            <path d="M6,64 C4,80 2,96 8,108 C14,120 26,124 30,114"
                  stroke="white" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.65"/>
            <!-- Large spiral at stem end (nautilus style) -->
            <path d="M30,114 C36,104 46,102 50,110 C54,118 48,128 40,126 C32,124 28,114 34,108 C40,102 50,102 54,110 C58,118 52,130 42,130"
                  stroke="white" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.6"/>

            <!-- Branch to the right -->
            <path d="M48,48 C62,38 78,40 76,52 C74,62 60,64 52,58"
                  stroke="white" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.55"/>
            <!-- Spiral on branch -->
            <path d="M76,52 C84,42 94,44 92,54 C90,62 80,62 76,56 C72,50 76,42 84,42"
                  stroke="white" stroke-width="1.6" stroke-linecap="round" fill="none" opacity="0.5"/>

            <!-- Upper branch -->
            <path d="M100,12 C110,4 122,6 120,16 C118,24 106,26 100,20"
                  stroke="white" stroke-width="1.8" stroke-linecap="round" fill="none" opacity="0.5"/>
            <!-- Spiral on upper branch -->
            <path d="M120,16 C128,8 138,10 136,20 C134,28 124,28 120,22"
                  stroke="white" stroke-width="1.4" stroke-linecap="round" fill="none" opacity="0.45"/>

            <!-- Pointed leaf pairs (like the card) -->
            <path d="M48,48 C38,36 24,36 26,48 C28,58 44,60 48,50 Z" fill="white" opacity="0.35"/>
            <path d="M48,48 C56,36 70,38 68,50 C66,60 50,60 48,50 Z" fill="white" opacity="0.32"/>

            <path d="M100,12 C92,2 78,2 80,14 C82,24 98,24 100,14 Z" fill="white" opacity="0.3"/>
            <path d="M100,12 C108,2 122,4 120,16 C118,26 102,24 100,14 Z" fill="white" opacity="0.28"/>

            <path d="M6,64 C-2,54 -4,40 6,38 C16,36 22,50 14,60 C10,66 6,66 6,64 Z" fill="white" opacity="0.28"/>

            <!-- Small leaf cluster lower -->
            <path d="M18,90 C10,82 8,70 16,70 C24,70 28,82 20,88 Z" fill="white" opacity="0.26"/>
            <path d="M18,90 C26,82 28,70 20,70 C12,70 8,82 16,88 Z" fill="white" opacity="0.24"/>

            <!-- Flower at wave edge (48,48) -->
            <circle cx="48" cy="46" r="7" fill="white" opacity="0.32"/>
            <path d="M48,38 C52,34 57,36 56,41 C55,45 49,45 48,46 C47,45 41,45 40,41 C39,36 44,34 48,38Z" fill="white" opacity="0.42"/>
            <path d="M56,46 C60,42 64,46 62,51 C60,55 55,53 48,46 C54,49 59,51 56,46Z" fill="white" opacity="0.38"/>
            <path d="M48,54 C44,58 39,56 40,51 C41,47 47,47 48,46 C49,47 55,47 56,51 C57,56 52,58 48,54Z" fill="white" opacity="0.42"/>
            <path d="M40,46 C36,42 38,37 43,38 C47,39 47,44 48,46 C47,48 43,50 40,50 C36,49 37,50 40,46Z" fill="white" opacity="0.38"/>
            <circle cx="48" cy="46" r="3.5" fill="white" opacity="0.65"/>

            <!-- Small flower upper (100,12) -->
            <circle cx="100" cy="10" r="5" fill="white" opacity="0.35"/>
            <path d="M100,4 C103,1 107,3 106,7 C105,10 101,10 100,10 C99,10 95,10 94,7 C93,3 97,1 100,4Z" fill="white" opacity="0.45"/>
            <path d="M106,10 C109,7 112,10 110,14 C108,17 104,15 100,10 C104,12 108,14 106,10Z" fill="white" opacity="0.4"/>
            <path d="M100,16 C97,19 93,17 94,13 C95,10 99,10 100,10 C101,10 105,10 106,13 C107,17 103,19 100,16Z" fill="white" opacity="0.45"/>
            <path d="M94,10 C91,7 92,3 96,4 C99,5 99,9 100,10 C99,12 96,13 93,12 C90,12 91,13 94,10Z" fill="white" opacity="0.4"/>
            <circle cx="100" cy="10" r="2.5" fill="white" opacity="0.7"/>

            <!-- Berry clusters -->
            <circle cx="4"  cy="100" r="3"   fill="white" opacity="0.5"/>
            <circle cx="12" cy="97"  r="2.5" fill="white" opacity="0.45"/>
            <circle cx="2"  cy="93"  r="2"   fill="white" opacity="0.42"/>
            <circle cx="140" cy="8"  r="2.5" fill="white" opacity="0.38"/>
            <circle cx="150" cy="4"  r="2"   fill="white" opacity="0.35"/>
            <circle cx="160" cy="8"  r="1.8" fill="white" opacity="0.32"/>
          </svg>

          <!-- Right floral — mirror -->
          <svg class="floral floral-right" viewBox="0 0 170 140" xmlns="http://www.w3.org/2000/svg">
            <path d="M170,0 L0,0 C22,4 48,2 70,12 C92,22 104,40 122,48 C138,55 156,52 164,64 C170,72 170,85 170,95 Z"
                  fill="white" opacity="0.22"/>
            <path d="M170,0 C125,6 92,4 75,22 C58,40 66,62 82,72 C98,82 122,78 138,90 C152,100 160,118 170,128 Z"
                  fill="white" opacity="0.11"/>

            <path d="M164,64 C166,80 168,96 162,108 C156,120 144,124 140,114"
                  stroke="white" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.65"/>
            <path d="M140,114 C134,104 124,102 120,110 C116,118 122,128 130,126 C138,124 142,114 136,108 C130,102 120,102 116,110 C112,118 118,130 128,130"
                  stroke="white" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.6"/>

            <path d="M122,48 C108,38 92,40 94,52 C96,62 110,64 118,58"
                  stroke="white" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.55"/>
            <path d="M94,52 C86,42 76,44 78,54 C80,62 90,62 94,56 C98,50 94,42 86,42"
                  stroke="white" stroke-width="1.6" stroke-linecap="round" fill="none" opacity="0.5"/>

            <path d="M70,12 C60,4 48,6 50,16 C52,24 64,26 70,20"
                  stroke="white" stroke-width="1.8" stroke-linecap="round" fill="none" opacity="0.5"/>
            <path d="M50,16 C42,8 32,10 34,20 C36,28 46,28 50,22"
                  stroke="white" stroke-width="1.4" stroke-linecap="round" fill="none" opacity="0.45"/>

            <path d="M122,48 C132,36 146,36 144,48 C142,58 126,60 122,50 Z" fill="white" opacity="0.35"/>
            <path d="M122,48 C114,36 100,38 102,50 C104,60 120,60 122,50 Z" fill="white" opacity="0.32"/>

            <path d="M70,12 C78,2 92,2 90,14 C88,24 72,24 70,14 Z" fill="white" opacity="0.3"/>
            <path d="M70,12 C62,2 48,4 50,16 C52,26 68,24 70,14 Z" fill="white" opacity="0.28"/>

            <path d="M164,64 C172,54 174,40 164,38 C154,36 148,50 156,60 C160,66 164,66 164,64 Z" fill="white" opacity="0.28"/>

            <path d="M152,90 C160,82 162,70 154,70 C146,70 142,82 150,88 Z" fill="white" opacity="0.26"/>
            <path d="M152,90 C144,82 142,70 150,70 C158,70 162,82 154,88 Z" fill="white" opacity="0.24"/>

            <!-- Flower -->
            <circle cx="122" cy="46" r="7" fill="white" opacity="0.32"/>
            <path d="M122,38 C118,34 113,36 114,41 C115,45 121,45 122,46 C123,45 129,45 130,41 C131,36 126,34 122,38Z" fill="white" opacity="0.42"/>
            <path d="M114,46 C110,42 106,46 108,51 C110,55 115,53 122,46 C116,49 111,51 114,46Z" fill="white" opacity="0.38"/>
            <path d="M122,54 C126,58 131,56 130,51 C129,47 123,47 122,46 C121,47 115,47 114,51 C113,56 118,58 122,54Z" fill="white" opacity="0.42"/>
            <path d="M130,46 C134,42 132,37 127,38 C123,39 123,44 122,46 C123,48 127,50 130,50 C134,49 133,50 130,46Z" fill="white" opacity="0.38"/>
            <circle cx="122" cy="46" r="3.5" fill="white" opacity="0.65"/>

            <!-- Small flower -->
            <circle cx="70" cy="10" r="5" fill="white" opacity="0.35"/>
            <path d="M70,4 C67,1 63,3 64,7 C65,10 69,10 70,10 C71,10 75,10 76,7 C77,3 73,1 70,4Z" fill="white" opacity="0.45"/>
            <path d="M64,10 C61,7 58,10 60,14 C62,17 66,15 70,10 C66,12 62,14 64,10Z" fill="white" opacity="0.4"/>
            <path d="M70,16 C73,19 77,17 76,13 C75,10 71,10 70,10 C69,10 65,10 64,13 C63,17 67,19 70,16Z" fill="white" opacity="0.45"/>
            <path d="M76,10 C79,7 78,3 74,4 C71,5 71,9 70,10 C71,12 74,13 77,12 C80,12 79,13 76,10Z" fill="white" opacity="0.4"/>
            <circle cx="70" cy="10" r="2.5" fill="white" opacity="0.7"/>

            <circle cx="166" cy="100" r="3"   fill="white" opacity="0.5"/>
            <circle cx="158" cy="97"  r="2.5" fill="white" opacity="0.45"/>
            <circle cx="168" cy="93"  r="2"   fill="white" opacity="0.42"/>
            <circle cx="30"  cy="8"   r="2.5" fill="white" opacity="0.38"/>
            <circle cx="20"  cy="4"   r="2"   fill="white" opacity="0.35"/>
            <circle cx="10"  cy="8"   r="1.8" fill="white" opacity="0.32"/>
          </svg>

          <!-- Top center — circular scroll ornament -->
          <svg class="floral-center-top" viewBox="0 0 100 38" xmlns="http://www.w3.org/2000/svg">
            <!-- Left scroll -->
            <path d="M50,36 C50,28 42,20 34,24 C26,28 24,38 30,42 C36,46 44,40 42,34 C40,28 32,26 28,30"
                  stroke="white" stroke-width="1.8" stroke-linecap="round" fill="none" opacity="0.6"/>
            <!-- Right scroll -->
            <path d="M50,36 C50,28 58,20 66,24 C74,28 76,38 70,42 C64,46 56,40 58,34 C60,28 68,26 72,30"
                  stroke="white" stroke-width="1.8" stroke-linecap="round" fill="none" opacity="0.6"/>
            <!-- Stem up -->
            <path d="M50,36 L50,18" stroke="white" stroke-width="1.8" stroke-linecap="round" opacity="0.6"/>
            <!-- Central flower -->
            <circle cx="50" cy="12" r="6" fill="white" opacity="0.35"/>
            <path d="M50,5 C53,2 57,4 56,8 C55,11 51,11 50,12 C49,11 45,11 44,8 C43,4 47,2 50,5Z" fill="white" opacity="0.5"/>
            <path d="M57,12 C60,9 63,12 61,16 C59,19 55,17 50,12 C55,14 59,16 57,12Z" fill="white" opacity="0.45"/>
            <path d="M50,19 C47,22 43,20 44,16 C45,13 49,13 50,12 C51,13 55,13 56,16 C57,20 53,22 50,19Z" fill="white" opacity="0.5"/>
            <path d="M43,12 C40,9 41,5 45,6 C48,7 49,10 50,12 C49,14 46,15 43,15 C40,14 41,15 43,12Z" fill="white" opacity="0.45"/>
            <circle cx="50" cy="12" r="3" fill="white" opacity="0.75"/>
            <!-- Side leaves -->
            <path d="M34,24 C28,18 24,10 30,8 C36,6 40,16 36,22 Z" fill="white" opacity="0.3"/>
            <path d="M66,24 C72,18 76,10 70,8 C64,6 60,16 64,22 Z" fill="white" opacity="0.3"/>
            <circle cx="28" cy="30" r="2" fill="white" opacity="0.45"/>
            <circle cx="72" cy="30" r="2" fill="white" opacity="0.45"/>
          </svg>

          <!-- Brand name -->
          <div class="brand-wrapper">
            <span class="brand-script">Valdete</span>
            <span class="brand-sub">MODAS</span>
          </div>
        </div>

        <!-- Tagline -->
        <p class="brand-tagline">Moda feminina, masculina, infantil e acessórios</p>

        <div class="divider"></div>

        <!-- Form -->
        <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <div class="form-group">
            <label class="form-label" for="email">E-mail</label>
            <input
              id="email" type="email" class="form-control"
              [class.error]="showError('email')"
              formControlName="email" placeholder="seu@email.com" autocomplete="email"
            />
            @if (showError('email')) {
              <span class="form-error">E-mail inválido</span>
            }
          </div>

          <div class="form-group" style="margin-top:16px;">
            <label class="form-label" for="password">Senha</label>
            <div class="password-wrapper">
              <input
                id="password" [type]="showPwd() ? 'text' : 'password'"
                class="form-control" [class.error]="showError('password')"
                formControlName="password" placeholder="••••••••" autocomplete="current-password"
              />
              <button type="button" class="pwd-toggle" (click)="showPwd.set(!showPwd())"
                [attr.aria-label]="showPwd() ? 'Ocultar senha' : 'Mostrar senha'">
                @if (showPwd()) {
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                }
              </button>
            </div>
            @if (showError('password')) {
              <span class="form-error">Senha obrigatória (mín. 4 caracteres)</span>
            }
          </div>

          <button type="submit" class="btn btn-primary btn-lg"
            style="width:100%;margin-top:28px;" [disabled]="loading()">
            @if (loading()) {
              <span class="btn-spinner"></span> Entrando...
            } @else {
              Entrar
            }
          </button>
        </form>

        <p class="login-hint">
          <strong>Demo:</strong> admin&#64;valdetmodas.com.br / qualquer senha
        </p>
      </div>
    </div>
  `,
  styles: [`
    .login-shell {
      min-height: 100vh;
      display: flex; align-items: center; justify-content: center;
      padding: 40px 20px;
      position: relative; overflow-x: hidden; overflow-y: auto;
      background:
        radial-gradient(ellipse 80% 60% at 15% 10%, rgba(184,124,196,0.24) 0%, transparent 60%),
        radial-gradient(ellipse 60% 50% at 85% 90%, rgba(123,45,139,0.18) 0%, transparent 55%),
        radial-gradient(ellipse 50% 40% at 90% 10%, rgba(232,200,240,0.32) 0%, transparent 50%),
        #f5eef8;
    }

    .bg-blob {
      position: absolute; border-radius: 50%; pointer-events: none; filter: blur(45px);
    }
    .bg-blob-1 {
      width: 340px; height: 340px; top: -80px; left: -80px;
      background: radial-gradient(circle, rgba(123,45,139,0.20) 0%, transparent 70%);
      animation: blobFloat 8s ease-in-out infinite;
    }
    .bg-blob-2 {
      width: 260px; height: 260px; bottom: -60px; right: -60px;
      background: radial-gradient(circle, rgba(184,124,196,0.25) 0%, transparent 70%);
      animation: blobFloat 10s ease-in-out infinite reverse;
    }
    .bg-blob-3 {
      width: 200px; height: 200px; top: 40%; left: 5%;
      background: radial-gradient(circle, rgba(232,200,240,0.35) 0%, transparent 70%);
      animation: blobFloat 13s ease-in-out infinite 2s;
    }
    @keyframes blobFloat {
      0%,100% { transform: translate(0,0) scale(1); }
      33%      { transform: translate(20px,-15px) scale(1.06); }
      66%      { transform: translate(-10px,10px) scale(0.97); }
    }

    /* Card */
    .login-card {
      background: #fff;
      border-radius: 24px;
      box-shadow: 0 4px 6px rgba(123,45,139,0.07), 0 14px 48px rgba(123,45,139,0.16), 0 0 0 1px rgba(123,45,139,0.08);
      width: 100%; max-width: 430px;
      position: relative; z-index: 1; overflow: hidden;
    }

    /* Light botanical header */
    .card-header {
      background: linear-gradient(180deg, #fff 0%, #fdf6ff 55%, #f3e5f8 100%);
      padding: 36px 32px 28px;
      position: relative; overflow: hidden;
      display: flex; align-items: center; justify-content: center;
      min-height: 140px;
      border-bottom: 1px solid #ead5f0;
    }

    /* Floral SVGs */
    .floral { position: absolute; top: 0; pointer-events: none; }
    .floral-left  { left: 0;  width: 155px; height: 125px; }
    .floral-right { right: 0; width: 155px; height: 125px; }

    .floral-center-top {
      position: absolute; top: 0; left: 50%; transform: translateX(-50%);
      width: 80px; height: 32px; pointer-events: none;
    }

    /* Brand */
    .brand-wrapper {
      display: flex; flex-direction: column; align-items: center;
      position: relative; z-index: 1;
    }
    .brand-script {
      font-family: var(--font-script);
      font-size: 4rem; line-height: 1.1;
      background: linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 50%, var(--color-primary-light) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      display: block;
      filter: drop-shadow(0 1px 3px rgba(123,45,139,0.18));
    }
    .brand-sub {
      font-family: var(--font-display);
      font-size: 0.72rem; color: var(--color-text-muted);
      letter-spacing: 0.48em; text-transform: uppercase;
      margin-top: 0; display: block;
    }

    /* Body */
    .brand-tagline {
      font-size: 0.78rem; color: var(--color-text-muted);
      text-align: center; padding: 14px 32px 0;
      font-style: italic; margin: 0;
    }
    .divider { margin: 14px 32px 20px; }
    form { padding: 0 32px; }

    .password-wrapper { position: relative; }
    .pwd-toggle {
      position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
      background: none; border: none; cursor: pointer;
      color: var(--color-text-muted); display: flex; align-items: center; padding: 4px;
    }
    .pwd-toggle:hover { color: var(--color-primary); }
    .password-wrapper .form-control { padding-right: 44px; }

    .btn-spinner {
      width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff;
      border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block;
    }

    .login-hint {
      margin: 20px 32px 28px; font-size: 0.78rem; color: var(--color-text-muted);
      text-align: center; padding: 10px;
      background: var(--color-accent-light); border-radius: var(--radius-sm);
    }

    @media (max-width: 480px) {
      .brand-script { font-size: 3.3rem; }
      .card-header  { padding: 28px 16px 22px; min-height: 120px; }
      .floral-left, .floral-right { width: 120px; height: 100px; }
      form, .divider, .login-hint { padding-left: 20px; padding-right: 20px; }
      .login-hint { margin-left: 20px; margin-right: 20px; }
    }
  `],
})
export class LoginPageComponent {
  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private router = inject(Router);
  private toast  = inject(ToastService);

  loading   = signal(false);
  showPwd   = signal(false);
  submitted = signal(false);

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
