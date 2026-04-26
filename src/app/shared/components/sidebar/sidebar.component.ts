import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <!-- Mobile overlay -->
    @if (open()) {
      <div class="sidebar-overlay" (click)="open.set(false)"></div>
    }

    <!-- Toggle button (mobile) -->
    <button class="sidebar-toggle" (click)="open.set(!open())" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>

    <aside class="sidebar" [class.open]="open()">

      <!-- Floral watermark top-right -->
      <svg class="sidebar-floral-tr" viewBox="0 0 120 110" xmlns="http://www.w3.org/2000/svg">
        <!-- Filled wave from top-right corner -->
        <path d="M120,0 L0,0 C20,4 45,2 65,14 C85,26 90,48 108,58 C118,64 120,72 120,80 Z"
              fill="white" opacity="0.14"/>
        <!-- Main stem -->
        <path d="M65,14 C72,6 84,8 82,18 C80,26 68,28 64,20"
              stroke="white" stroke-width="1.6" stroke-linecap="round" fill="none" opacity="0.22"/>
        <!-- Spiral -->
        <path d="M82,18 C90,10 100,12 98,22 C96,30 86,30 82,24"
              stroke="white" stroke-width="1.3" stroke-linecap="round" fill="none" opacity="0.2"/>
        <!-- Pointed leaves -->
        <path d="M65,14 C57,4 44,4 46,14 C48,22 63,22 65,15 Z" fill="white" opacity="0.18"/>
        <path d="M65,14 C73,4 86,6 84,16 C82,24 66,22 65,15 Z" fill="white" opacity="0.16"/>
        <!-- Lower vine -->
        <path d="M108,58 C100,50 90,52 88,62 C86,72 96,76 102,68"
              stroke="white" stroke-width="1.4" stroke-linecap="round" fill="none" opacity="0.19"/>
        <path d="M88,62 C80,54 70,56 70,66 C70,74 80,76 84,68"
              stroke="white" stroke-width="1.2" stroke-linecap="round" fill="none" opacity="0.16"/>
        <!-- Small flower -->
        <circle cx="65" cy="13" r="4" fill="white" opacity="0.2"/>
        <path d="M65,8 C68,5 72,7 71,11 C70,14 66,14 65,13 C64,14 60,14 59,11 C58,7 62,5 65,8Z" fill="white" opacity="0.24"/>
        <circle cx="65" cy="13" r="2" fill="white" opacity="0.32"/>
        <circle cx="102" cy="68" r="2.5" fill="white" opacity="0.2"/>
        <circle cx="84"  cy="68" r="2"   fill="white" opacity="0.18"/>
        <circle cx="98"  cy="22" r="2"   fill="white" opacity="0.18"/>
      </svg>

      <!-- Floral watermark bottom-left -->
      <svg class="sidebar-floral-bl" viewBox="0 0 120 110" xmlns="http://www.w3.org/2000/svg">
        <!-- Filled wave from bottom-left corner -->
        <path d="M0,110 L120,110 C100,106 75,108 55,96 C35,84 30,62 12,52 C2,46 0,38 0,30 Z"
              fill="white" opacity="0.14"/>
        <!-- Main stem -->
        <path d="M55,96 C48,104 36,102 38,92 C40,84 52,82 56,90"
              stroke="white" stroke-width="1.6" stroke-linecap="round" fill="none" opacity="0.22"/>
        <!-- Spiral -->
        <path d="M38,92 C30,100 20,98 22,88 C24,80 34,80 38,86"
              stroke="white" stroke-width="1.3" stroke-linecap="round" fill="none" opacity="0.2"/>
        <!-- Pointed leaves -->
        <path d="M55,96 C63,106 76,106 74,96 C72,88 57,88 55,95 Z" fill="white" opacity="0.18"/>
        <path d="M55,96 C47,106 34,104 36,94 C38,86 54,88 55,95 Z" fill="white" opacity="0.16"/>
        <!-- Upper vine -->
        <path d="M12,52 C20,60 30,58 32,48 C34,38 24,34 18,42"
              stroke="white" stroke-width="1.4" stroke-linecap="round" fill="none" opacity="0.19"/>
        <path d="M32,48 C40,56 50,54 50,44 C50,36 40,34 36,42"
              stroke="white" stroke-width="1.2" stroke-linecap="round" fill="none" opacity="0.16"/>
        <!-- Small flower -->
        <circle cx="55" cy="97" r="4" fill="white" opacity="0.2"/>
        <path d="M55,102 C52,105 48,103 49,99 C50,96 54,96 55,97 C56,96 60,96 61,99 C62,103 58,105 55,102Z" fill="white" opacity="0.24"/>
        <circle cx="55" cy="97" r="2" fill="white" opacity="0.32"/>
        <circle cx="18" cy="42" r="2.5" fill="white" opacity="0.2"/>
        <circle cx="36" cy="42" r="2"   fill="white" opacity="0.18"/>
        <circle cx="22" cy="88" r="2"   fill="white" opacity="0.18"/>
      </svg>

      <!-- Brand -->
      <div class="sidebar-brand">
        <span class="brand-script">Valdete</span>
        <span class="brand-sub">modas</span>
      </div>

      <!-- User -->
      <div class="sidebar-user">
        <div class="user-avatar">{{ userInitial() }}</div>
        <div class="user-info">
          <span class="user-name">{{ user()?.name }}</span>
          <span class="user-role">{{ roleLabel() }}</span>
        </div>
      </div>

      <div class="sidebar-divider"></div>

      <!-- Nav -->
      <nav class="sidebar-nav">
        @for (item of navItems; track item.route) {
          <a
            [routerLink]="item.route"
            routerLinkActive="active"
            class="nav-item"
            (click)="open.set(false)"
          >
            <span class="nav-icon" [innerHTML]="item.icon"></span>
            <span>{{ item.label }}</span>
          </a>
        }
      </nav>

      <div class="sidebar-spacer"></div>

      <!-- Logout -->
      <button class="nav-item logout-btn" (click)="logout()">
        <span class="nav-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"/>
          </svg>
        </span>
        <span>Sair</span>
      </button>
    </aside>
  `,
  styles: [`
    :host { display: contents; }

    .sidebar-overlay {
      display: none;
      position: fixed; inset: 0;
      background: rgba(45,27,53,0.4);
      z-index: 99;
    }

    .sidebar-toggle {
      display: none;
      position: fixed; top: 16px; left: 16px; z-index: 101;
      background: var(--color-primary);
      border: none; border-radius: 8px; padding: 10px; cursor: pointer;
      flex-direction: column; gap: 4px;
    }
    .sidebar-toggle span {
      display: block; width: 20px; height: 2px;
      background: #fff; border-radius: 2px;
    }

    .sidebar {
      width: 248px; min-height: 100vh;
      background: linear-gradient(160deg, var(--color-primary-dark) 0%, var(--color-primary) 100%);
      display: flex; flex-direction: column;
      padding: 24px 0; position: sticky; top: 0; height: 100vh;
      box-shadow: var(--shadow-lg); flex-shrink: 0;
      transition: transform 0.3s ease;
      overflow: hidden;
    }

    .sidebar-floral-tr {
      position: absolute; top: 0; right: 0;
      width: 120px; height: 110px; pointer-events: none;
    }
    .sidebar-floral-bl {
      position: absolute; bottom: 0; left: 0;
      width: 120px; height: 110px; pointer-events: none;
    }

    .sidebar-brand {
      display: flex; flex-direction: column; align-items: center;
      padding: 0 24px 20px; line-height: 1;
    }
    .brand-script {
      font-family: var(--font-script); font-size: 2.8rem; color: #fff;
      text-shadow: 2px 2px 8px rgba(0,0,0,0.3);
    }
    .brand-sub {
      font-family: var(--font-display); font-size: 0.85rem; color: rgba(255,255,255,0.7);
      letter-spacing: 0.3em; text-transform: uppercase; margin-top: -6px;
    }

    .sidebar-user {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 20px; margin: 0 12px;
      background: rgba(255,255,255,0.1); border-radius: 12px;
    }
    .user-avatar {
      width: 38px; height: 38px; border-radius: 50%;
      background: rgba(255,255,255,0.2); color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 1rem; font-family: var(--font-display); flex-shrink: 0;
    }
    .user-name { display: block; color: #fff; font-size: 0.85rem; font-weight: 600; }
    .user-role { display: block; color: rgba(255,255,255,0.6); font-size: 0.75rem; }

    .sidebar-divider {
      height: 1px; background: rgba(255,255,255,0.15); margin: 16px 20px;
    }

    .sidebar-nav { display: flex; flex-direction: column; gap: 4px; padding: 0 12px; }

    .nav-item {
      display: flex; align-items: center; gap: 12px;
      padding: 11px 14px; border-radius: 10px;
      color: rgba(255,255,255,0.75); font-size: 0.875rem; font-weight: 500;
      text-decoration: none; cursor: pointer; border: none;
      background: transparent; width: 100%; text-align: left;
      font-family: var(--font-body);
      transition: background 0.15s, color 0.15s;
    }
    .nav-item:hover { background: rgba(255,255,255,0.12); color: #fff; }
    .nav-item.active { background: rgba(255,255,255,0.2); color: #fff; font-weight: 600; }

    .nav-icon { display: flex; align-items: center; width: 18px; flex-shrink: 0; }

    .sidebar-spacer { flex: 1; }

    .logout-btn {
      margin: 0 12px;
      color: rgba(255,255,255,0.6);
    }
    .logout-btn:hover { background: rgba(255,100,100,0.2); color: #ffaaaa; }

    @media (max-width: 768px) {
      .sidebar-overlay { display: block; }
      .sidebar-toggle  { display: flex; }
      .sidebar {
        position: fixed; top: 0; left: 0; z-index: 100;
        transform: translateX(-100%); height: 100vh;
      }
      .sidebar.open { transform: translateX(0); }
    }
  `],
})
export class SidebarComponent {
  private auth  = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);

  open = signal(false);
  user = this.auth.currentUser;

  userInitial = () => this.user()?.name?.charAt(0).toUpperCase() ?? 'U';
  roleLabel   = () => this.user()?.role === 'admin' ? 'Administrador' : 'Vendedor';

  navItems: NavItem[] = [
    {
      label: 'Dashboard', route: '/dashboard',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`,
    },
    {
      label: 'Nova Venda', route: '/sales/new',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.4 5.4A1 1 0 007 20h10M10 20a1 1 0 102 0M17 20a1 1 0 102 0"/></svg>`,
    },
    {
      label: 'Vendas', route: '/sales',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>`,
    },
    {
      label: 'Produtos', route: '/products',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>`,
    },
    {
      label: 'Cadastrar Produto', route: '/products/new',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>`,
    },
  ];

  logout(): void {
    this.auth.logout();
    this.toast.success('Até logo!');
    this.router.navigate(['/login']);
  }
}
