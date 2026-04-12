import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
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
  
  // Static layout data
  user: any = {
    name: 'Raúl Herrero',
    email: 'admin@erphome.com',
    role: 'Administrador Senior',
    avatar: 'RH'
  };

  // Static model targets
  passwords = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  // Visibilidad
  hideOld: boolean = true;
  hideNew: boolean = true;
  hideConfirm: boolean = true;

  constructor() {}

  ngOnInit(): void {
    // init logic
  }

  cambiarPassword() {
    console.log('Cambio de contraseña solicitado', this.passwords);
  }
}
