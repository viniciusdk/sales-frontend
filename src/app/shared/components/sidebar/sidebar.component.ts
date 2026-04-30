import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

interface NavItem { label: string; route: string; icon: string; }
interface NavGroup { label?: string; items: NavItem[]; }

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

      <!-- Watermark — top-right only -->
      <svg class="sidebar-floral-tr" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M100,0 L0,0 C22,5 48,3 66,18 C82,30 88,55 100,66 Z" fill="white" opacity="0.07"/>
        <!-- Small blossom -->
        <g transform="translate(72,22)">
          <path d="M0,0 C-4,-6.5 -3.2,-13 0,-15.5 C3.2,-13 4,-6.5 0,0" fill="rgba(255,255,255,0.42)" transform="rotate(0)"/>
          <path d="M0,0 C-4,-6.5 -3.2,-13 0,-15.5 C3.2,-13 4,-6.5 0,0" fill="rgba(255,255,255,0.42)" transform="rotate(72)"/>
          <path d="M0,0 C-4,-6.5 -3.2,-13 0,-15.5 C3.2,-13 4,-6.5 0,0" fill="rgba(255,255,255,0.42)" transform="rotate(144)"/>
          <path d="M0,0 C-4,-6.5 -3.2,-13 0,-15.5 C3.2,-13 4,-6.5 0,0" fill="rgba(255,255,255,0.42)" transform="rotate(216)"/>
          <path d="M0,0 C-4,-6.5 -3.2,-13 0,-15.5 C3.2,-13 4,-6.5 0,0" fill="rgba(255,255,255,0.42)" transform="rotate(288)"/>
          <circle r="3.2" fill="rgba(255,255,255,0.65)"/>
        </g>
        <!-- Small leaf -->
        <g transform="translate(86,46)">
          <path d="M0,0 C3.1,-3.96 4,-8.58 0,-11 C-4,-8.58 -3.1,-3.96 0,0" fill="rgba(255,255,255,0.28)" transform="rotate(22)"/>
        </g>
        <circle cx="54" cy="10" r="2" fill="white" opacity="0.14"/>
        <circle cx="42" cy="6"  r="1.6" fill="white" opacity="0.11"/>
      </svg>

      <!-- Brand -->
      <div class="sidebar-brand">
        <span class="brand-script">Valdete</span>
        <span class="brand-sub">modas</span>
      </div>

      <!-- User info -->
      <div class="sidebar-user">
        <div class="user-avatar">{{ userInitial() }}</div>
        <div class="user-info">
          <span class="user-name">{{ user()?.name }}</span>
          <span class="user-role">{{ roleLabel() }}</span>
        </div>
      </div>

      <div class="sidebar-divider"></div>

      <!-- Grouped nav -->
      <nav class="sidebar-nav">
        @for (group of navGroups; track $index) {
          @if (group.label) {
            <div class="nav-group-label">{{ group.label }}</div>
          }
          @for (item of group.items; track item.route) {
            <a
              [routerLink]="item.route"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{exact: true}"
              class="nav-item"
              (click)="open.set(false)"
            >
              <span class="nav-icon" [innerHTML]="trust(item.icon)"></span>
              <span>{{ item.label }}</span>
            </a>
          }
        }
      </nav>

      <!-- Logout -->
      <div class="sidebar-logout-wrap">
        <button class="nav-item logout-btn" (click)="logout()">
          <span class="nav-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </span>
          <span>Sair</span>
        </button>
      </div>
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
      width: 256px; min-height: 100vh;
      background: linear-gradient(160deg, #4A1858 0%, #6E2480 60%, #8030A0 100%);
      display: flex; flex-direction: column;
      padding: 20px 0 0; position: sticky; top: 0; height: 100vh;
      box-shadow: 4px 0 24px rgba(74,24,88,0.22); flex-shrink: 0;
      transition: transform 0.3s ease;
      overflow: hidden; position: relative;
    }

    .sidebar-floral-tr {
      position: absolute; top: 0; right: 0;
      width: 100px; height: 100px; pointer-events: none; z-index: 0;
    }

    /* Brand */
    .sidebar-brand {
      display: flex; flex-direction: column; align-items: center;
      padding: 12px 20px 18px; line-height: 1; position: relative; z-index: 1;
    }
    .brand-script {
      font-family: var(--font-script); font-size: 3rem; color: #fff;
      text-shadow: 0 2px 12px rgba(0,0,0,0.2);
      display: block; line-height: 1.15;
    }
    .brand-sub {
      font-family: var(--font-display); font-size: 0.72rem;
      color: rgba(255,255,255,0.58);
      letter-spacing: 0.38em; text-transform: uppercase; margin-top: -4px;
    }

    /* User */
    .sidebar-user {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 14px; margin: 0 10px 14px;
      background: rgba(255,255,255,0.12); border-radius: 12px;
      position: relative; z-index: 1;
    }
    .user-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: rgba(255,255,255,0.22); color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 0.95rem; flex-shrink: 0;
      box-shadow: 0 0 0 2px rgba(255,255,255,0.14);
    }
    .user-info { overflow: hidden; }
    .user-name {
      display: block; color: #fff; font-size: 0.83rem; font-weight: 700;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .user-role { display: block; color: rgba(255,255,255,0.54); font-size: 0.7rem; }

    .sidebar-divider {
      height: 1px; background: rgba(255,255,255,0.15); margin: 0 20px 8px;
    }

    /* Nav */
    .sidebar-nav {
      display: flex; flex-direction: column; gap: 0;
      padding: 0 10px; flex: 1; overflow-y: auto; position: relative; z-index: 1;
    }

    .nav-group-label {
      font-size: 0.62rem; font-weight: 800;
      color: rgba(255,255,255,0.36);
      text-transform: uppercase; letter-spacing: 0.1em;
      padding: 8px 14px 4px; margin-top: 4px;
    }

    .nav-item {
      display: flex; align-items: center; gap: 11px;
      padding: 9px 13px; border-radius: 9px;
      color: rgba(255,255,255,0.68); font-size: 0.855rem; font-weight: 500;
      text-decoration: none; cursor: pointer; border: none;
      background: transparent; width: 100%; text-align: left;
      font-family: var(--font-body);
      transition: background 0.15s, color 0.15s;
      margin-bottom: 1px;
    }
    .nav-item:hover { background: rgba(255,255,255,0.1); color: #fff; }
    .nav-item.active {
      background: rgba(255,255,255,0.2); color: #fff; font-weight: 700;
      box-shadow: inset 0 0 0 1px rgba(255,255,255,0.18);
    }

    .nav-icon { display: flex; align-items: center; width: 18px; flex-shrink: 0; }

    .sidebar-logout-wrap {
      padding: 10px;
      border-top: 1px solid rgba(255,255,255,0.1);
      margin-top: 4px; position: relative; z-index: 2;
      background: linear-gradient(160deg, #4A1858 0%, #6E2480 60%, #8030A0 100%);
    }

    .logout-btn { color: rgba(255,255,255,0.46); }
    .logout-btn:hover { background: rgba(255,70,70,0.18); color: #ffaaaa; }

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
  private auth      = inject(AuthService);
  private toast     = inject(ToastService);
  private router    = inject(Router);
  private sanitizer = inject(DomSanitizer);

  open = signal(false);

  trust(html: string): SafeHtml { return this.sanitizer.bypassSecurityTrustHtml(html); }
  user = this.auth.currentUser;

  userInitial = () => this.user()?.name?.charAt(0).toUpperCase() ?? 'U';
  roleLabel   = () => this.user()?.role === 'admin' ? 'Administradora' : 'Vendedor';

  navGroups: NavGroup[] = [
    {
      items: [
        { label: 'Dashboard', route: '/dashboard', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>` },
      ]
    },
    {
      label: 'Vendas',
      items: [
        { label: 'Nova Venda', route: '/sales/new', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>` },
        { label: 'Histórico', route: '/sales', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16l3-1.5L9 20l2-1.5L13 20l2-1.5L17 20l2-1.5V8z"/><path d="M10 9h4M10 13h4M10 17h2"/></svg>` },
      ]
    },
    {
      label: 'Estoque',
      items: [
        { label: 'Produtos', route: '/products', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/></svg>` },
        { label: 'Cadastrar Produto', route: '/products/new', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>` },
        { label: 'Importar Produtos', route: '/products/import', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>` },
      ]
    },
    {
      label: 'Gestão',
      items: [
        { label: 'Usuários', route: '/users', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>` },
      ]
    },
  ];

  logout(): void {
    this.auth.logout();
    this.toast.success('Até logo!');
    this.router.navigate(['/login']);
  }
}
