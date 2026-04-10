import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { ActivatedRoute, Route } from '@angular/router';
import { UsuarioService } from '../servicios/usuario-service';
import { firstValueFrom } from 'rxjs';
import { RolService } from '../servicios/rol-service';
import { PermisoService } from '../servicios/permiso-service';
import { ModuloService } from '../servicios/modulo-service';

@Component({
  selector: 'app-asignar-usuario',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatChipsModule,
  ],
  templateUrl: './asignar-usuario.html',
  styleUrl: './asignar-usuario.css',
})
export class AsignarUsuario implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private cdr: ChangeDetectorRef,
    private rolService: RolService,
    private permisoService: PermisoService,
    private moduloService:ModuloService
  ) {}
  idUser: number = 0;
  selectedUserRaw: any;
  selectedUser: any;
  roles:any[] = [];

  async getRoles() {
    const roles = await firstValueFrom(this.rolService.getRoles());
    this.roles = roles.data;
  }

  async getModulosJuntoPermisos() {
    const modulos:any = await firstValueFrom(this.moduloService.getModulos());
    modulos.forEach((modulo:any) => {
      const permisos = firstValueFrom(this.permisoService.getPermisosPorModulo(modulo.id));
      modulo.permisos = permisos;
    });
    console.log(modulos)
  }

  async ngOnInit(): Promise<void> {
    this.idUser = this.route.snapshot.params['id'];
    this.selectedUserRaw = await firstValueFrom(this.usuarioService.getUsuario(this.idUser));
    this.selectedUser = this.selectedUserRaw.data;
    this.selectedUser.avatar = this.selectedUser.name.substring(0, 2).toUpperCase();
    await this.getRoles();
    await this.getModulosJuntoPermisos();
    this.cdr.detectChanges();
  }


  modules = [
    {
      name: 'Usuarios',
      icon: 'people',
      permissions: [
        { id: 'u_read', name: 'Leer', active: true },
        { id: 'u_create', name: 'Crear', active: false },
        { id: 'u_update', name: 'Editar', active: false },
        { id: 'u_delete', name: 'Eliminar', active: false },
      ],
    },
    {
      name: 'Ventas',
      icon: 'shopping_cart',
      permissions: [
        { id: 'v_read', name: 'Leer', active: true },
        { id: 'v_create', name: 'Crear', active: true },
        { id: 'v_update', name: 'Editar', active: false },
        { id: 'v_print', name: 'Imprimir', active: true },
      ],
    },
    {
      name: 'Inventario',
      icon: 'inventory_2',
      permissions: [
        { id: 'i_read', name: 'Leer', active: true },
        { id: 'i_manage', name: 'Gestionar Stock', active: false },
        { id: 'i_reports', name: 'Reportes', active: false },
      ],
    },
    {
      name: 'Configuración',
      icon: 'settings',
      permissions: [
        { id: 's_read', name: 'Leer', active: true },
        { id: 's_system', name: 'Ajustes Sistema', active: false },
        { id: 's_backup', name: 'Backups', active: false },
      ],
    },
  ];
}
