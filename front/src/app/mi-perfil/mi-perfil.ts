import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../moduloAutenticacion/servicios/usuario-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mi-perfil',
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.css',
})
export class MiPerfil implements OnInit {

  private usuarioService = inject(UsuarioService);
  private router = inject(Router);

  userName = signal<string>('');
  userEmail = signal<string>('');
  userRole = signal<string>('');
  userAvatar = signal<string>('');

  passwords = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  hideOld = signal(true);
  hideNew = signal(true);
  hideConfirm = signal(true);

  ngOnInit(): void {
    this.usuarioService.me().subscribe({
      next: (data: any) => {
        const partes = data.name?.trim().split(' ') ?? [];
        const avatar = (partes[0]?.charAt(0) ?? '').toUpperCase() + (partes[1]?.charAt(0) ?? '').toUpperCase();
        this.userName.set(data.name ?? '');
        this.userEmail.set(data.email ?? '');
        this.userRole.set(data.role ?? '');
        this.userAvatar.set(avatar);
      },
      error: (err) => {
        console.error('Error cargando perfil', err);
      }
    });
  }

  mensajeError = signal<string>('');

  cambiarContrasenya() {
    this.mensajeError.set('');
    this.usuarioService.cambiarContrasenya(this.passwords).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.mensajeError.set(err?.error?.error ?? err?.error?.message ?? err?.message ?? 'Error al cambiar la contraseña');
      }
    });
  }
} 