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
  templateUrl: './sidebar.component.html',
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
