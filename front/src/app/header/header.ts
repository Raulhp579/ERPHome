import { Component, signal, inject, output, effect } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink, Router } from '@angular/router';
import { UsuarioService } from '../moduloAutenticacion/servicios/usuario-service';
import { AuthService } from '../moduloAutenticacion/servicios/auth-service';

@Component({
  selector: 'app-header',
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    RouterLink,
    MatDividerModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  readonly toggleSidenav = output<void>();

  private usuarioService = inject(UsuarioService);
  private authService = inject(AuthService);
  private router = inject(Router);

  userName = signal<string>('Usuario');
  userId = signal<number | null>(null);
  userInitial = signal<string>('U');

  constructor() {
    effect(() => {
      if (!this.authService.isLoggedIn()) {
        this.userName.set('Usuario');
        this.userId.set(null);
        this.userInitial.set('U');
        return;
      }
      this.usuarioService.me().subscribe({
        next: (user) => {
          if (user) {
            this.userName.set(user.name || 'Usuario');
            this.userId.set(user.id);
            this.userInitial.set(user.name ? user.name.charAt(0).toUpperCase() : 'U');
          }
        },
        error: (err) => {
          console.error('Error fetching user info', err);
          this.userInitial.set('?');
        }
      });
    });
  }

  onToggle() {
    this.toggleSidenav.emit();
  }

  navigateToProfile() {
    if (this.userId()) {
      this.router.navigate(['/perfil', this.userId()]);
    }
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error during logout', err);
        // Fallback: clear token and redirect anyway
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      }
    });
  }
}
