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

      <!-- Falling petals -->
      @for (p of petals; track p.id) {
        <div class="petal-wrap" [style.left]="p.left + '%'" [style.animation-duration]="p.dur + 's'" [style.animation-delay]="p.delay + 's'">
          <svg [attr.width]="p.size" [attr.height]="p.size * 1.4" viewBox="0 0 20 28">
            <defs>
              <linearGradient [attr.id]="'fpg' + p.id" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" [attr.stop-color]="p.color" stop-opacity="0.9"/>
                <stop offset="100%" [attr.stop-color]="p.color" stop-opacity="0.25"/>
              </linearGradient>
            </defs>
            <path [attr.d]="'M10,26 C4,20 2,12 10,2 C18,12 16,20 10,26'" [attr.fill]="'url(#fpg' + p.id + ')'" [attr.transform]="'rotate(' + p.rot + ',10,14)'"/>
          </svg>
        </div>
      }

      <div class="login-card animate-in">

        <!-- Botanical floral header -->
        <div class="card-header">
          <svg class="login-floral" viewBox="0 0 430 210" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="lhBg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#f5eeff"/><stop offset="100%" stop-color="#ddc8f8"/>
              </linearGradient>
              <linearGradient id="lhFade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="50%" stop-color="rgba(255,255,255,0)"/>
                <stop offset="100%" stop-color="rgba(255,255,255,0.97)"/>
              </linearGradient>
              <!-- Magnolia petal gradient -->
              <radialGradient id="pg1" cx="50%" cy="75%" r="80%">
                <stop offset="0%" stop-color="#E8D8FF"/>
                <stop offset="35%" stop-color="#9B4DB3"/>
                <stop offset="75%" stop-color="#6A2080"/>
                <stop offset="100%" stop-color="#3E0F58"/>
              </radialGradient>
              <radialGradient id="pg2" cx="50%" cy="75%" r="80%">
                <stop offset="0%" stop-color="#F0E4FF"/>
                <stop offset="40%" stop-color="#B870D8"/>
                <stop offset="100%" stop-color="#7A2A98"/>
              </radialGradient>
              <radialGradient id="cg1" cx="45%" cy="45%" r="60%">
                <stop offset="0%" stop-color="#FFFDE0"/>
                <stop offset="60%" stop-color="#F5D860"/>
                <stop offset="100%" stop-color="#C8A820"/>
              </radialGradient>
              <!-- Small blossom gradient -->
              <radialGradient id="bg1" cx="50%" cy="70%" r="75%">
                <stop offset="0%" stop-color="#EEE0FF"/>
                <stop offset="45%" stop-color="#9B50C8"/>
                <stop offset="100%" stop-color="#5A1880"/>
              </radialGradient>
            </defs>
            <rect width="430" height="210" fill="url(#lhBg)"/>

            <!-- Decorative background arcs -->
            <ellipse cx="80" cy="90" rx="70" ry="70" fill="none" stroke="#9B4DB3" stroke-width="0.5" opacity="0.12"/>
            <ellipse cx="350" cy="90" rx="70" ry="70" fill="none" stroke="#9B4DB3" stroke-width="0.5" opacity="0.12"/>
            <ellipse cx="215" cy="30" rx="50" ry="50" fill="none" stroke="#7B2D8B" stroke-width="0.5" opacity="0.1"/>

            <!-- Left stem -->
            <path d="M-2,210 C12,178 10,145 22,116 C36,82 58,68 76,44" stroke="#3D7A50" stroke-width="2.6" fill="none" stroke-linecap="round"/>
            <path d="M40,138 C56,118 72,112 80,92" stroke="#3D7A50" stroke-width="1.9" fill="none" stroke-linecap="round"/>
            <path d="M22,116 C6,96 2,74 14,58" stroke="#3D7A50" stroke-width="1.7" fill="none" stroke-linecap="round"/>
            <!-- Left leaves -->
            <g transform="translate(40,138)">
              <path d="M0,0 C11.16,-10.08 13.65,-21.28 0,-28 C-13.65,-21.28 -11.16,-10.08 0,0" fill="#52A868" opacity="0.9" transform="rotate(-42)"/>
              <line x1="0" y1="-2" x2="0" y2="-24.08" stroke="#2F6038" stroke-width="0.9" opacity="0.45" transform="rotate(-42)"/>
            </g>
            <g transform="translate(22,116)">
              <path d="M0,0 C8.68,-7.92 10.92,-16.72 0,-22 C-10.92,-16.72 -8.68,-7.92 0,0" fill="#458C58" opacity="0.9" transform="rotate(38)"/>
            </g>
            <g transform="translate(14,58)">
              <path d="M0,0 C7.02,-6.48 9.36,-13.68 0,-18 C-9.36,-13.68 -7.02,-6.48 0,0" fill="#52A868" opacity="0.9" transform="rotate(-20)"/>
            </g>
            <!-- Left main magnolia at (76,44) -->
            <g transform="translate(76,44)">
              <!-- Outer petals shadow -->
              <path d="M0,0 C-10.44,-8.7 -16.2,-20.88 -6.96,-31.32 C0,-35.96 6.96,-31.32 16.2,-20.88 C10.44,-8.7 0,0" fill="#3E0F58" opacity="0.12" transform="rotate(0) translate(0,2)"/>
              <!-- Outer 6 petals -->
              <path d="M0,0 C-10.44,-8.7 -16.2,-20.88 -6.96,-31.32 C0,-35.96 6.96,-31.32 16.2,-20.88 C10.44,-8.7 0,0" fill="url(#pg1)" opacity="0.9" transform="rotate(0)"/>
              <path d="M0,0 C-10.44,-8.7 -16.2,-20.88 -6.96,-31.32 C0,-35.96 6.96,-31.32 16.2,-20.88 C10.44,-8.7 0,0" fill="url(#pg1)" opacity="0.9" transform="rotate(60)"/>
              <path d="M0,0 C-10.44,-8.7 -16.2,-20.88 -6.96,-31.32 C0,-35.96 6.96,-31.32 16.2,-20.88 C10.44,-8.7 0,0" fill="url(#pg1)" opacity="0.9" transform="rotate(120)"/>
              <path d="M0,0 C-10.44,-8.7 -16.2,-20.88 -6.96,-31.32 C0,-35.96 6.96,-31.32 16.2,-20.88 C10.44,-8.7 0,0" fill="url(#pg1)" opacity="0.9" transform="rotate(180)"/>
              <path d="M0,0 C-10.44,-8.7 -16.2,-20.88 -6.96,-31.32 C0,-35.96 6.96,-31.32 16.2,-20.88 C10.44,-8.7 0,0" fill="url(#pg1)" opacity="0.9" transform="rotate(240)"/>
              <path d="M0,0 C-10.44,-8.7 -16.2,-20.88 -6.96,-31.32 C0,-35.96 6.96,-31.32 16.2,-20.88 C10.44,-8.7 0,0" fill="url(#pg1)" opacity="0.9" transform="rotate(300)"/>
              <!-- Inner 6 petals -->
              <path d="M0,0 C-6.96,-5.8 -10.44,-13.92 -4.64,-20.88 C0,-23.84 4.64,-20.88 10.44,-13.92 C6.96,-5.8 0,0" fill="url(#pg2)" opacity="0.95" transform="rotate(30)"/>
              <path d="M0,0 C-6.96,-5.8 -10.44,-13.92 -4.64,-20.88 C0,-23.84 4.64,-20.88 10.44,-13.92 C6.96,-5.8 0,0" fill="url(#pg2)" opacity="0.95" transform="rotate(90)"/>
              <path d="M0,0 C-6.96,-5.8 -10.44,-13.92 -4.64,-20.88 C0,-23.84 4.64,-20.88 10.44,-13.92 C6.96,-5.8 0,0" fill="url(#pg2)" opacity="0.95" transform="rotate(150)"/>
              <path d="M0,0 C-6.96,-5.8 -10.44,-13.92 -4.64,-20.88 C0,-23.84 4.64,-20.88 10.44,-13.92 C6.96,-5.8 0,0" fill="url(#pg2)" opacity="0.95" transform="rotate(210)"/>
              <path d="M0,0 C-6.96,-5.8 -10.44,-13.92 -4.64,-20.88 C0,-23.84 4.64,-20.88 10.44,-13.92 C6.96,-5.8 0,0" fill="url(#pg2)" opacity="0.95" transform="rotate(270)"/>
              <path d="M0,0 C-6.96,-5.8 -10.44,-13.92 -4.64,-20.88 C0,-23.84 4.64,-20.88 10.44,-13.92 C6.96,-5.8 0,0" fill="url(#pg2)" opacity="0.95" transform="rotate(330)"/>
              <!-- Center -->
              <circle r="6.96" fill="url(#cg1)"/>
              <circle r="4.06" fill="#E8C820" opacity="0.9"/>
            </g>
            <!-- Left blossom at (80,92) — 5 petals -->
            <g transform="translate(80,92)">
              <path d="M0,0 C-4.16,-3.12 -5.72,-7.8 -2.34,-11.44 C0,-13 2.34,-11.44 5.72,-7.8 C4.16,-3.12 0,0" fill="url(#bg1)" opacity="0.88" transform="rotate(0)"/>
              <path d="M0,0 C-4.16,-3.12 -5.72,-7.8 -2.34,-11.44 C0,-13 2.34,-11.44 5.72,-7.8 C4.16,-3.12 0,0" fill="url(#bg1)" opacity="0.88" transform="rotate(72)"/>
              <path d="M0,0 C-4.16,-3.12 -5.72,-7.8 -2.34,-11.44 C0,-13 2.34,-11.44 5.72,-7.8 C4.16,-3.12 0,0" fill="url(#bg1)" opacity="0.88" transform="rotate(144)"/>
              <path d="M0,0 C-4.16,-3.12 -5.72,-7.8 -2.34,-11.44 C0,-13 2.34,-11.44 5.72,-7.8 C4.16,-3.12 0,0" fill="url(#bg1)" opacity="0.88" transform="rotate(216)"/>
              <path d="M0,0 C-4.16,-3.12 -5.72,-7.8 -2.34,-11.44 C0,-13 2.34,-11.44 5.72,-7.8 C4.16,-3.12 0,0" fill="url(#bg1)" opacity="0.88" transform="rotate(288)"/>
              <circle r="3.38" fill="#FFF8D0" opacity="0.95"/>
              <circle r="1.82" fill="#E8C030" opacity="0.9"/>
            </g>
            <!-- Small blossom at (14,58) -->
            <g transform="translate(14,58)">
              <path d="M0,0 C-2.72,-2.04 -3.74,-5.1 -1.53,-7.48 C0,-8.5 1.53,-7.48 3.74,-5.1 C2.72,-2.04 0,0" fill="url(#bg1)" opacity="0.8" transform="rotate(0)"/>
              <path d="M0,0 C-2.72,-2.04 -3.74,-5.1 -1.53,-7.48 C0,-8.5 1.53,-7.48 3.74,-5.1 C2.72,-2.04 0,0" fill="url(#bg1)" opacity="0.8" transform="rotate(72)"/>
              <path d="M0,0 C-2.72,-2.04 -3.74,-5.1 -1.53,-7.48 C0,-8.5 1.53,-7.48 3.74,-5.1 C2.72,-2.04 0,0" fill="url(#bg1)" opacity="0.8" transform="rotate(144)"/>
              <path d="M0,0 C-2.72,-2.04 -3.74,-5.1 -1.53,-7.48 C0,-8.5 1.53,-7.48 3.74,-5.1 C2.72,-2.04 0,0" fill="url(#bg1)" opacity="0.8" transform="rotate(216)"/>
              <path d="M0,0 C-2.72,-2.04 -3.74,-5.1 -1.53,-7.48 C0,-8.5 1.53,-7.48 3.74,-5.1 C2.72,-2.04 0,0" fill="url(#bg1)" opacity="0.8" transform="rotate(288)"/>
              <circle r="2.21" fill="#FFF8D0" opacity="0.95"/>
            </g>
            <!-- Bud -->
            <ellipse cx="58" cy="62" rx="5" ry="10" fill="#9B4DB3" opacity="0.65"/>
            <ellipse cx="58" cy="62" rx="3" ry="6" fill="#C8A0E8" opacity="0.55"/>

            <!-- Right side — mirror -->
            <g transform="translate(430,0) scale(-1,1)">
              <path d="M-2,210 C12,178 10,145 22,116 C36,82 58,68 76,44" stroke="#3D7A50" stroke-width="2.6" fill="none" stroke-linecap="round"/>
              <path d="M40,138 C56,118 72,112 80,92" stroke="#3D7A50" stroke-width="1.9" fill="none" stroke-linecap="round"/>
              <path d="M22,116 C6,96 2,74 14,58" stroke="#3D7A50" stroke-width="1.7" fill="none" stroke-linecap="round"/>
              <g transform="translate(40,138)">
                <path d="M0,0 C11.16,-10.08 13.65,-21.28 0,-28 C-13.65,-21.28 -11.16,-10.08 0,0" fill="#52A868" opacity="0.9" transform="rotate(42)"/>
              </g>
              <g transform="translate(22,116)">
                <path d="M0,0 C8.68,-7.92 10.92,-16.72 0,-22 C-10.92,-16.72 -8.68,-7.92 0,0" fill="#458C58" opacity="0.9" transform="rotate(-38)"/>
              </g>
              <g transform="translate(14,58)">
                <path d="M0,0 C7.02,-6.48 9.36,-13.68 0,-18 C-9.36,-13.68 -7.02,-6.48 0,0" fill="#52A868" opacity="0.9" transform="rotate(20)"/>
              </g>
              <g transform="translate(76,44)">
                <path d="M0,0 C-10.44,-8.7 -16.2,-20.88 -6.96,-31.32 C0,-35.96 6.96,-31.32 16.2,-20.88 C10.44,-8.7 0,0" fill="url(#pg1)" opacity="0.9" transform="rotate(0)"/>
                <path d="M0,0 C-10.44,-8.7 -16.2,-20.88 -6.96,-31.32 C0,-35.96 6.96,-31.32 16.2,-20.88 C10.44,-8.7 0,0" fill="url(#pg1)" opacity="0.9" transform="rotate(60)"/>
                <path d="M0,0 C-10.44,-8.7 -16.2,-20.88 -6.96,-31.32 C0,-35.96 6.96,-31.32 16.2,-20.88 C10.44,-8.7 0,0" fill="url(#pg1)" opacity="0.9" transform="rotate(120)"/>
                <path d="M0,0 C-10.44,-8.7 -16.2,-20.88 -6.96,-31.32 C0,-35.96 6.96,-31.32 16.2,-20.88 C10.44,-8.7 0,0" fill="url(#pg1)" opacity="0.9" transform="rotate(180)"/>
                <path d="M0,0 C-10.44,-8.7 -16.2,-20.88 -6.96,-31.32 C0,-35.96 6.96,-31.32 16.2,-20.88 C10.44,-8.7 0,0" fill="url(#pg1)" opacity="0.9" transform="rotate(240)"/>
                <path d="M0,0 C-10.44,-8.7 -16.2,-20.88 -6.96,-31.32 C0,-35.96 6.96,-31.32 16.2,-20.88 C10.44,-8.7 0,0" fill="url(#pg1)" opacity="0.9" transform="rotate(300)"/>
                <path d="M0,0 C-6.96,-5.8 -10.44,-13.92 -4.64,-20.88 C0,-23.84 4.64,-20.88 10.44,-13.92 C6.96,-5.8 0,0" fill="url(#pg2)" opacity="0.95" transform="rotate(30)"/>
                <path d="M0,0 C-6.96,-5.8 -10.44,-13.92 -4.64,-20.88 C0,-23.84 4.64,-20.88 10.44,-13.92 C6.96,-5.8 0,0" fill="url(#pg2)" opacity="0.95" transform="rotate(90)"/>
                <path d="M0,0 C-6.96,-5.8 -10.44,-13.92 -4.64,-20.88 C0,-23.84 4.64,-20.88 10.44,-13.92 C6.96,-5.8 0,0" fill="url(#pg2)" opacity="0.95" transform="rotate(150)"/>
                <path d="M0,0 C-6.96,-5.8 -10.44,-13.92 -4.64,-20.88 C0,-23.84 4.64,-20.88 10.44,-13.92 C6.96,-5.8 0,0" fill="url(#pg2)" opacity="0.95" transform="rotate(210)"/>
                <path d="M0,0 C-6.96,-5.8 -10.44,-13.92 -4.64,-20.88 C0,-23.84 4.64,-20.88 10.44,-13.92 C6.96,-5.8 0,0" fill="url(#pg2)" opacity="0.95" transform="rotate(270)"/>
                <path d="M0,0 C-6.96,-5.8 -10.44,-13.92 -4.64,-20.88 C0,-23.84 4.64,-20.88 10.44,-13.92 C6.96,-5.8 0,0" fill="url(#pg2)" opacity="0.95" transform="rotate(330)"/>
                <circle r="6.96" fill="url(#cg1)"/>
                <circle r="4.06" fill="#E8C820" opacity="0.9"/>
              </g>
              <g transform="translate(80,92)">
                <path d="M0,0 C-4.16,-3.12 -5.72,-7.8 -2.34,-11.44 C0,-13 2.34,-11.44 5.72,-7.8 C4.16,-3.12 0,0" fill="url(#bg1)" opacity="0.88" transform="rotate(0)"/>
                <path d="M0,0 C-4.16,-3.12 -5.72,-7.8 -2.34,-11.44 C0,-13 2.34,-11.44 5.72,-7.8 C4.16,-3.12 0,0" fill="url(#bg1)" opacity="0.88" transform="rotate(72)"/>
                <path d="M0,0 C-4.16,-3.12 -5.72,-7.8 -2.34,-11.44 C0,-13 2.34,-11.44 5.72,-7.8 C4.16,-3.12 0,0" fill="url(#bg1)" opacity="0.88" transform="rotate(144)"/>
                <path d="M0,0 C-4.16,-3.12 -5.72,-7.8 -2.34,-11.44 C0,-13 2.34,-11.44 5.72,-7.8 C4.16,-3.12 0,0" fill="url(#bg1)" opacity="0.88" transform="rotate(216)"/>
                <path d="M0,0 C-4.16,-3.12 -5.72,-7.8 -2.34,-11.44 C0,-13 2.34,-11.44 5.72,-7.8 C4.16,-3.12 0,0" fill="url(#bg1)" opacity="0.88" transform="rotate(288)"/>
                <circle r="3.38" fill="#FFF8D0" opacity="0.95"/>
                <circle r="1.82" fill="#E8C030" opacity="0.9"/>
              </g>
              <g transform="translate(14,58)">
                <path d="M0,0 C-2.72,-2.04 -3.74,-5.1 -1.53,-7.48 C0,-8.5 1.53,-7.48 3.74,-5.1 C2.72,-2.04 0,0" fill="url(#bg1)" opacity="0.8" transform="rotate(0)"/>
                <path d="M0,0 C-2.72,-2.04 -3.74,-5.1 -1.53,-7.48 C0,-8.5 1.53,-7.48 3.74,-5.1 C2.72,-2.04 0,0" fill="url(#bg1)" opacity="0.8" transform="rotate(72)"/>
                <path d="M0,0 C-2.72,-2.04 -3.74,-5.1 -1.53,-7.48 C0,-8.5 1.53,-7.48 3.74,-5.1 C2.72,-2.04 0,0" fill="url(#bg1)" opacity="0.8" transform="rotate(144)"/>
                <path d="M0,0 C-2.72,-2.04 -3.74,-5.1 -1.53,-7.48 C0,-8.5 1.53,-7.48 3.74,-5.1 C2.72,-2.04 0,0" fill="url(#bg1)" opacity="0.8" transform="rotate(216)"/>
                <path d="M0,0 C-2.72,-2.04 -3.74,-5.1 -1.53,-7.48 C0,-8.5 1.53,-7.48 3.74,-5.1 C2.72,-2.04 0,0" fill="url(#bg1)" opacity="0.8" transform="rotate(288)"/>
                <circle r="2.21" fill="#FFF8D0" opacity="0.95"/>
              </g>
              <ellipse cx="58" cy="62" rx="5" ry="10" fill="#9B4DB3" opacity="0.65"/>
              <ellipse cx="58" cy="62" rx="3" ry="6" fill="#C8A0E8" opacity="0.55"/>
            </g>

            <!-- Center: small magnolia + ornament -->
            <g transform="translate(215,12)">
              <path d="M0,0 C-4.32,-3.6 -6.48,-8.64 -2.88,-12.96 C0,-14.88 2.88,-12.96 6.48,-8.64 C4.32,-3.6 0,0" fill="url(#pg1)" opacity="0.9" transform="rotate(0)"/>
              <path d="M0,0 C-4.32,-3.6 -6.48,-8.64 -2.88,-12.96 C0,-14.88 2.88,-12.96 6.48,-8.64 C4.32,-3.6 0,0" fill="url(#pg1)" opacity="0.9" transform="rotate(60)"/>
              <path d="M0,0 C-4.32,-3.6 -6.48,-8.64 -2.88,-12.96 C0,-14.88 2.88,-12.96 6.48,-8.64 C4.32,-3.6 0,0" fill="url(#pg1)" opacity="0.9" transform="rotate(120)"/>
              <path d="M0,0 C-4.32,-3.6 -6.48,-8.64 -2.88,-12.96 C0,-14.88 2.88,-12.96 6.48,-8.64 C4.32,-3.6 0,0" fill="url(#pg1)" opacity="0.9" transform="rotate(180)"/>
              <path d="M0,0 C-4.32,-3.6 -6.48,-8.64 -2.88,-12.96 C0,-14.88 2.88,-12.96 6.48,-8.64 C4.32,-3.6 0,0" fill="url(#pg1)" opacity="0.9" transform="rotate(240)"/>
              <path d="M0,0 C-4.32,-3.6 -6.48,-8.64 -2.88,-12.96 C0,-14.88 2.88,-12.96 6.48,-8.64 C4.32,-3.6 0,0" fill="url(#pg1)" opacity="0.9" transform="rotate(300)"/>
              <circle r="4.32" fill="url(#cg1)"/>
              <circle r="2.16" fill="#E8C820" opacity="0.9"/>
            </g>
            <path d="M190,34 C198,42 207,44 215,38 C223,44 232,42 240,34" stroke="#8B3AB8" stroke-width="1.3" fill="none" opacity="0.45" stroke-linecap="round"/>

            <!-- Sparkles -->
            <g transform="translate(152,18)"><line x1="-3.5" y1="0" x2="3.5" y2="0" stroke="#8B3AB8" stroke-width="0.9" opacity="0.55"/><line x1="0" y1="-3.5" x2="0" y2="3.5" stroke="#8B3AB8" stroke-width="0.9" opacity="0.55"/><circle r="1.4" fill="#B870D8" opacity="0.8"/></g>
            <g transform="translate(278,14)"><line x1="-3.5" y1="0" x2="3.5" y2="0" stroke="#8B3AB8" stroke-width="0.9" opacity="0.55"/><line x1="0" y1="-3.5" x2="0" y2="3.5" stroke="#8B3AB8" stroke-width="0.9" opacity="0.55"/><circle r="1.4" fill="#B870D8" opacity="0.8"/></g>
            <g transform="translate(162,32)"><line x1="-3.5" y1="0" x2="3.5" y2="0" stroke="#8B3AB8" stroke-width="0.9" opacity="0.55"/><line x1="0" y1="-3.5" x2="0" y2="3.5" stroke="#8B3AB8" stroke-width="0.9" opacity="0.55"/><circle r="1.4" fill="#B870D8" opacity="0.8"/></g>
            <g transform="translate(268,30)"><line x1="-3.5" y1="0" x2="3.5" y2="0" stroke="#8B3AB8" stroke-width="0.9" opacity="0.55"/><line x1="0" y1="-3.5" x2="0" y2="3.5" stroke="#8B3AB8" stroke-width="0.9" opacity="0.55"/><circle r="1.4" fill="#B870D8" opacity="0.8"/></g>
            <g transform="translate(198,8)"><line x1="-3.5" y1="0" x2="3.5" y2="0" stroke="#8B3AB8" stroke-width="0.9" opacity="0.55"/><line x1="0" y1="-3.5" x2="0" y2="3.5" stroke="#8B3AB8" stroke-width="0.9" opacity="0.55"/><circle r="1.4" fill="#B870D8" opacity="0.8"/></g>
            <g transform="translate(232,9)"><line x1="-3.5" y1="0" x2="3.5" y2="0" stroke="#8B3AB8" stroke-width="0.9" opacity="0.55"/><line x1="0" y1="-3.5" x2="0" y2="3.5" stroke="#8B3AB8" stroke-width="0.9" opacity="0.55"/><circle r="1.4" fill="#B870D8" opacity="0.8"/></g>

            <!-- Side blossoms -->
            <g transform="translate(138,26)">
              <path d="M0,0 C-2.4,-1.8 -3.3,-4.5 -1.35,-6.6 C0,-7.5 1.35,-6.6 3.3,-4.5 C2.4,-1.8 0,0" fill="url(#bg1)" opacity="0.85" transform="rotate(0)"/>
              <path d="M0,0 C-2.4,-1.8 -3.3,-4.5 -1.35,-6.6 C0,-7.5 1.35,-6.6 3.3,-4.5 C2.4,-1.8 0,0" fill="url(#bg1)" opacity="0.85" transform="rotate(72)"/>
              <path d="M0,0 C-2.4,-1.8 -3.3,-4.5 -1.35,-6.6 C0,-7.5 1.35,-6.6 3.3,-4.5 C2.4,-1.8 0,0" fill="url(#bg1)" opacity="0.85" transform="rotate(144)"/>
              <path d="M0,0 C-2.4,-1.8 -3.3,-4.5 -1.35,-6.6 C0,-7.5 1.35,-6.6 3.3,-4.5 C2.4,-1.8 0,0" fill="url(#bg1)" opacity="0.85" transform="rotate(216)"/>
              <path d="M0,0 C-2.4,-1.8 -3.3,-4.5 -1.35,-6.6 C0,-7.5 1.35,-6.6 3.3,-4.5 C2.4,-1.8 0,0" fill="url(#bg1)" opacity="0.85" transform="rotate(288)"/>
              <circle r="1.95" fill="#FFF8D0" opacity="0.95"/>
            </g>
            <g transform="translate(292,22)">
              <path d="M0,0 C-2.08,-1.56 -2.86,-3.9 -1.17,-5.72 C0,-6.5 1.17,-5.72 2.86,-3.9 C2.08,-1.56 0,0" fill="url(#bg1)" opacity="0.85" transform="rotate(0)"/>
              <path d="M0,0 C-2.08,-1.56 -2.86,-3.9 -1.17,-5.72 C0,-6.5 1.17,-5.72 2.86,-3.9 C2.08,-1.56 0,0" fill="url(#bg1)" opacity="0.85" transform="rotate(72)"/>
              <path d="M0,0 C-2.08,-1.56 -2.86,-3.9 -1.17,-5.72 C0,-6.5 1.17,-5.72 2.86,-3.9 C2.08,-1.56 0,0" fill="url(#bg1)" opacity="0.85" transform="rotate(144)"/>
              <path d="M0,0 C-2.08,-1.56 -2.86,-3.9 -1.17,-5.72 C0,-6.5 1.17,-5.72 2.86,-3.9 C2.08,-1.56 0,0" fill="url(#bg1)" opacity="0.85" transform="rotate(216)"/>
              <path d="M0,0 C-2.08,-1.56 -2.86,-3.9 -1.17,-5.72 C0,-6.5 1.17,-5.72 2.86,-3.9 C2.08,-1.56 0,0" fill="url(#bg1)" opacity="0.85" transform="rotate(288)"/>
              <circle r="1.69" fill="#FFF8D0" opacity="0.95"/>
            </g>

            <!-- Berries -->
            <circle cx="148" cy="10" r="2.8" fill="#7B2D8B" opacity="0.75"/>
            <circle cx="158" cy="5"  r="2.8" fill="#7B2D8B" opacity="0.75"/>
            <circle cx="154" cy="16" r="2.8" fill="#7B2D8B" opacity="0.75"/>
            <circle cx="272" cy="7"  r="2.8" fill="#6A2080" opacity="0.75"/>
            <circle cx="283" cy="12" r="2.8" fill="#6A2080" opacity="0.75"/>
            <circle cx="278" cy="4"  r="2.8" fill="#6A2080" opacity="0.75"/>

            <rect width="430" height="210" fill="url(#lhFade)"/>
          </svg>

          <!-- Brand -->
          <div class="brand-wrapper">
            <span class="brand-script">Valdete</span>
            <span class="brand-sub">MODAS</span>
          </div>
        </div>

        <!-- Body -->
        <p class="brand-tagline">Moda feminina, masculina, infantil e acessórios</p>
        <div class="header-divider"></div>

        <form [formGroup]="form" (ngSubmit)="submit()" novalidate style="padding: 0 32px;">
          <div class="form-group">
            <label class="form-label" for="email">E-mail</label>
            <input id="email" type="email" class="form-control" [class.error]="showError('email')"
              formControlName="email" placeholder="seu@email.com" autocomplete="email"/>
            @if (showError('email')) {
              <span class="form-error">E-mail inválido</span>
            }
          </div>

          <div class="form-group" style="margin-top: 14px;">
            <label class="form-label" for="password">Senha</label>
            <div class="password-wrapper">
              <input id="password" [type]="showPwd() ? 'text' : 'password'"
                class="form-control" [class.error]="showError('password')"
                formControlName="password" placeholder="••••••••" autocomplete="current-password"/>
              <button type="button" class="pwd-toggle" (click)="showPwd.set(!showPwd())"
                [attr.aria-label]="showPwd() ? 'Ocultar senha' : 'Mostrar senha'">
                @if (showPwd()) {
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                }
              </button>
            </div>
            @if (showError('password')) {
              <span class="form-error">Senha obrigatória (mín. 4 caracteres)</span>
            }
          </div>

          <button type="submit" class="btn-submit" [disabled]="loading()">
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
        radial-gradient(ellipse 80% 60% at 15% 10%, rgba(184,80,220,0.20) 0%, transparent 60%),
        radial-gradient(ellipse 60% 50% at 85% 90%, rgba(110,36,128,0.18) 0%, transparent 55%),
        #f2e8fa;
    }

    .bg-blob {
      position: absolute; border-radius: 50%; pointer-events: none; filter: blur(52px);
    }
    .bg-blob-1 {
      width: 420px; height: 420px; top: -120px; left: -120px;
      background: radial-gradient(circle, rgba(110,36,128,0.14) 0%, transparent 70%);
      animation: blobFloat 8s ease-in-out infinite;
    }
    .bg-blob-2 {
      width: 320px; height: 320px; bottom: -90px; right: -90px;
      background: radial-gradient(circle, rgba(184,124,196,0.20) 0%, transparent 70%);
      animation: blobFloat 11s ease-in-out infinite reverse;
    }
    @keyframes blobFloat {
      0%,100% { transform: translate(0,0) scale(1); }
      33%      { transform: translate(20px,-15px) scale(1.06); }
      66%      { transform: translate(-10px,10px) scale(0.97); }
    }

    /* Falling petals */
    .petal-wrap {
      position: absolute; top: -20px; pointer-events: none;
      animation: fall linear infinite;
    }
    @keyframes fall {
      0%   { transform: translateY(-20px) rotate(0deg); opacity: 0.9; }
      100% { transform: translateY(110vh) rotate(540deg); opacity: 0; }
    }

    /* Card */
    .login-card {
      background: #fff;
      border-radius: 28px;
      box-shadow: 0 2px 8px rgba(110,36,128,0.06), 0 12px 44px rgba(110,36,128,0.13), 0 0 0 1px rgba(110,36,128,0.06);
      width: 100%; max-width: 420px;
      position: relative; z-index: 1; overflow: hidden;
    }

    /* Header */
    .card-header {
      position: relative; height: 210px; overflow: hidden;
      border-bottom: 1px solid #e2ccf5;
    }
    .login-floral {
      position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: block;
    }

    /* Brand */
    .brand-wrapper {
      position: absolute; inset: 0; display: flex; flex-direction: column;
      align-items: center; justify-content: center; z-index: 2; padding-top: 20px;
    }
    .brand-script {
      font-family: var(--font-script);
      font-size: 3.7rem; line-height: 1.25;
      background: linear-gradient(140deg, #4A1858 0%, #7E2E9A 50%, #B870C8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      display: block; text-align: center;
      width: 100%; padding-left: 24px; padding-right: 24px;
    }
    .brand-sub {
      font-family: var(--font-display);
      font-size: 0.64rem; color: #7B4090;
      letter-spacing: 0.56em; text-transform: uppercase;
      margin-top: 2px; opacity: 0.8;
    }

    /* Body */
    .brand-tagline {
      font-family: var(--font-display);
      font-style: italic; font-size: 0.8rem; color: #7A5090;
      text-align: center; padding: 20px 32px 0; margin: 0;
    }
    .header-divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, #D0B8E8, transparent);
      margin: 14px 32px 18px;
    }

    .password-wrapper { position: relative; }
    .pwd-toggle {
      position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
      background: none; border: none; cursor: pointer;
      color: var(--color-text-muted); display: flex; align-items: center; padding: 4px;
    }
    .pwd-toggle:hover { color: var(--color-primary); }
    .password-wrapper .form-control { padding-right: 44px; }

    .btn-submit {
      width: 100%; margin-top: 22px; padding: 13px 24px;
      background: linear-gradient(135deg, #5A1868 0%, #9244C0 100%);
      color: #fff; border: none; border-radius: 10px;
      font-family: var(--font-body); font-size: 0.95rem; font-weight: 700;
      cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 9px;
      box-shadow: 0 4px 18px rgba(90,24,104,0.35);
      transition: opacity 0.2s, transform 0.15s;
    }
    .btn-submit:hover:not(:disabled) { transform: translateY(-1px); opacity: 0.93; }
    .btn-submit:disabled { opacity: 0.72; cursor: not-allowed; }

    .btn-spinner {
      width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff;
      border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block;
    }

    .login-hint {
      margin: 18px 32px 26px; font-size: 0.75rem; color: #7A5090;
      text-align: center; padding: 9px 14px;
      background: #F7EEFE; border-radius: 9px; border: 1px solid #E5D2F5;
    }

    @media (max-width: 480px) {
      .brand-script { font-size: 3rem; }
      .card-header  { height: 180px; }
      form, .header-divider, .login-hint, .brand-tagline { padding-left: 20px; padding-right: 20px; }
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
