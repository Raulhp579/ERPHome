import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RolService } from '../servicios/rol-service';
import { firstValueFrom } from 'rxjs';
import { ModuloService } from '../servicios/modulo-service';
import { PermisoService } from '../servicios/permiso-service';

@Component({
  selector: 'app-asignar-rol',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    RouterLink
  ],
  templateUrl: './asignar-rol.html',
  styleUrl: './asignar-rol.css',
})
export class AsignarRol implements OnInit {
  
  // Mock data for static layout visualization
  selectedRole: any = {};

  modules: any[] = [];

  permisosDelRol:Array<number> = [];


  constructor(
    private rolService:RolService,
    private route:ActivatedRoute,
    private moduloService:ModuloService,
    private cdr:ChangeDetectorRef,
    private permisoService:PermisoService
  ) {}

  ngOnInit(): void {
    this.obtenerRol()
    this.obtenerModulosPermisos()
    this.permisosRol()
  }


  async obtenerRol(){
    const idRol = this.route.snapshot.params['id'];
    const rol = await firstValueFrom(this.rolService.getRol(idRol))
    this.selectedRole = rol.data;
    this.cdr.detectChanges();
  }

  async obtenerModulosPermisos(){
    const modulos:any = await firstValueFrom(this.moduloService.getModulos());

    this.modules = modulos.data.map((modulo: any) => ({
      id: modulo.id,
      name: modulo.nombre,
      icon: modulo.icono,
      permissions: []
    }));

    await Promise.all(
      this.modules.map(async (modulo: any) => {
        const permisos: any = await firstValueFrom(this.permisoService.getPermisosPorModulo(modulo.id));
        modulo.permissions = permisos.data;
      })
    );

    this.cdr.detectChanges();
  }

  async permisosRol(){
    const idRol = this.route.snapshot.params['id'];
    const permisos:any = await firstValueFrom(this.permisoService.getPermisosRol(idRol));
    this.permisosDelRol = permisos.data.map((permiso: any) => permiso.id);
    this.cdr.detectChanges();
  }

  async agregarPermiso(id:number){
    const idRol = this.route.snapshot.params['id'];
    const permiso:any = await firstValueFrom(this.permisoService.asignarPermisoRol(id, idRol));
    this.permisosDelRol.push(permiso.data.id);
    this.cdr.detectChanges();
  }

  async quitarPermiso(id:number){
    const idRol = this.route.snapshot.params['id'];
    const permiso:any = await firstValueFrom(this.permisoService.quitarPermisoRol(id, idRol));
    this.permisosDelRol = this.permisosDelRol.filter((permiso: any) => permiso.id !== permiso.data.id);
    this.cdr.detectChanges();
  }

}
