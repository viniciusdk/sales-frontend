import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="app-shell">
      <app-sidebar />
      <main class="app-main">
        <div class="app-content">
          <router-outlet />
        </div>
      </main>
    </div>
  `,
  styles: [`
    .app-shell {
      display: flex; min-height: 100vh; width: 100%;
      background: var(--color-bg);
    }
    .app-main {
      flex: 1; min-width: 0; overflow-x: hidden;
      background: var(--color-bg);
      /* Subtle repeating floral tile in background */
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='none' stroke='%237B2D8B' stroke-width='0.5' opacity='0.045'%3E%3Cpath d='M40,10 C44,6 50,8 48,14 C46,19 41,19 40,18 C39,19 34,19 32,14 C30,8 36,6 40,10Z'/%3E%3Cpath d='M40,30 C44,26 50,28 48,34 C46,39 41,39 40,38 C39,39 34,39 32,34 C30,28 36,26 40,30Z'/%3E%3Ccircle cx='40' cy='14' r='3'/%3E%3Ccircle cx='20' cy='40' r='2'/%3E%3Ccircle cx='60' cy='40' r='2'/%3E%3Cpath d='M10,40 C14,36 20,38 18,44 C16,49 11,49 10,48' stroke-linecap='round'/%3E%3Cpath d='M70,40 C66,36 60,38 62,44 C64,49 69,49 70,48' stroke-linecap='round'/%3E%3Cpath d='M40,55 C44,51 50,53 48,59 C46,64 41,64 40,63' stroke-linecap='round'/%3E%3C/g%3E%3C/svg%3E");
    }
    .app-content {
      width: 100%; padding: 32px;
      box-sizing: border-box; position: relative;
    }
    /* Decorative corner floral on each page area */
    .app-content::after {
      content: '';
      position: fixed; bottom: 24px; right: 24px;
      width: 180px; height: 160px;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 180 160' fill='none'%3E%3Cpath d='M170,155 C155,130 138,125 128,108 C118,91 124,70 110,55 C96,40 75,38 62,22 C50,8 48,2 40,2' stroke='%237B2D8B' stroke-width='1.5' stroke-linecap='round' opacity='0.13'/%3E%3Cpath d='M180,130 C162,118 148,118 140,100 C132,82 140,62 124,48' stroke='%237B2D8B' stroke-width='1' stroke-linecap='round' opacity='0.1'/%3E%3Cpath d='M128,108 C136,100 146,102 144,112 C142,120 132,120 128,114' fill='%237B2D8B' opacity='0.09'/%3E%3Cpath d='M110,55 C118,47 128,49 126,59 C124,67 114,67 110,61' fill='%237B2D8B' opacity='0.09'/%3E%3Ccircle cx='128' cy='108' r='5' fill='%237B2D8B' opacity='0.1'/%3E%3Ccircle cx='110' cy='55'  r='4' fill='%237B2D8B' opacity='0.09'/%3E%3Ccircle cx='62'  cy='22'  r='3' fill='%237B2D8B' opacity='0.09'/%3E%3Cpath d='M140,100 C148,92 158,94 156,104 C154,112 144,112 140,106' fill='%237B2D8B' opacity='0.08'/%3E%3C/g%3E%3C/svg%3E");
      background-repeat: no-repeat;
      pointer-events: none; z-index: 0; opacity: 1;
    }
    @media (max-width: 768px) {
      .app-content { padding: 20px 16px; padding-top: 64px; }
      .app-content::after { display: none; }
    }
  `],
})
export class LayoutComponent {}
