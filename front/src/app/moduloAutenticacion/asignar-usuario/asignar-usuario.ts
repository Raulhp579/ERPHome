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
import { ActivatedRoute, Route, RouterLink } from '@angular/router';
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
    RouterLink
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
  modules:{name:string, icon:string, permissions:any[]}[] = [];
  permisosDeUnUsuario:any[] = [];

  async getRoles() {
    const roles = await firstValueFrom(this.rolService.getRoles());
    this.roles = roles.data;
  }

  async getModulosJuntoPermisos() {
    const modulos:any = await firstValueFrom(this.moduloService.getModulos());

    this.modules = await Promise.all(
      modulos.data.map(async (modulo:any) => {
        const permisos:any = await firstValueFrom(this.permisoService.getPermisosPorModulo(modulo.id));
        return {
          name: modulo.nombre,
          icon: modulo.icono,
          permissions: permisos.data
        };
      })
    );
  }

  async getPermisosDeUnUsuario(){
    const permisos = await firstValueFrom(this.permisoService.getPermisosDeUnUsuario(this.idUser));
    this.permisosDeUnUsuario = permisos.data.map((permiso:any) => permiso.id);
  }

  async getRolUsuario(){
    const rol = await firstValueFrom(this.rolService.getRolUsuario(this.idUser));
    this.selectedUser.rol = rol.data;   
  }

  async updateRolUsuario(id:number){
    await firstValueFrom(this.rolService.updateRolUsuario(this.idUser, {role_id: id}));
    await this.getRolUsuario();
    this.cdr.detectChanges();
  }
  

  async ngOnInit(): Promise<void> {
    this.idUser = this.route.snapshot.params['id'];
    this.selectedUserRaw = await firstValueFrom(this.usuarioService.getUsuario(this.idUser));
    this.selectedUser = this.selectedUserRaw.data;
    this.selectedUser.avatar = this.selectedUser.name.substring(0, 2).toUpperCase();
    await this.getRoles();
    await this.getRolUsuario();
    await this.getModulosJuntoPermisos();
    await this.getPermisosDeUnUsuario();
    this.cdr.detectChanges();
  }

  async asignarPermisoUsuario(id:number){
    await firstValueFrom(this.permisoService.asignarPermisoUsuario(id, this.idUser));
    await this.getPermisosDeUnUsuario();
    this.cdr.detectChanges();
  }

  async quitarPermisoUsuario(id:number){
    await firstValueFrom(this.permisoService.quitarPermisoUsuario(id, this.idUser));
    await this.getPermisosDeUnUsuario();
    this.cdr.detectChanges();
  }

}
