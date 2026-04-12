import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './moduloAutenticacion/login/login';
import { GestionUsuariosRolesPermisos } from './moduloAutenticacion/gestion-usuarios-roles-permisos/gestion-usuarios-roles-permisos';
import { AsignarUsuario } from './moduloAutenticacion/asignar-usuario/asignar-usuario';
import { Roles } from './moduloAutenticacion/roles/roles';
import { AsignarRol } from './moduloAutenticacion/asignar-rol/asignar-rol';
import { MiPerfil } from './mi-perfil/mi-perfil';
import { authGuard, guestGuard } from './moduloAutenticacion/guards/auth.guard';


export const routes: Routes = [
    { path: 'home', component: Home, canActivate: [authGuard] },
    { path: 'login', component: Login, canActivate: [guestGuard] },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'usuarios', component: GestionUsuariosRolesPermisos, canActivate: [authGuard] },
    { path: 'usuarios/asignar/:id', component: AsignarUsuario, canActivate: [authGuard] },
    { path: 'roles', component: Roles, canActivate: [authGuard] },
    { path: 'roles/asignar/:id', component: AsignarRol, canActivate: [authGuard] },
    { path: 'perfil/:id', component: MiPerfil, canActivate: [authGuard] }
];
