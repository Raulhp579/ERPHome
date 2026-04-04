import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './moduloAutenticacion/login/login';
import { GestionUsuariosRolesPermisos } from './moduloAutenticacion/gestion-usuarios-roles-permisos/gestion-usuarios-roles-permisos';
import { AsignarUsuario } from './moduloAutenticacion/asignar-usuario/asignar-usuario';
import { Roles } from './moduloAutenticacion/roles/roles';

export const routes: Routes = [
    { path: 'home', component: Home },
    { path: 'login', component: Login },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'usuarios', component: GestionUsuariosRolesPermisos },
    { path: 'usuarios/asignar/:id', component: AsignarUsuario },
    { path: 'roles', component: Roles }
];
