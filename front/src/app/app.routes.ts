import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './moduloAutenticacion/login/login';

export const routes: Routes = [
    { path: 'home', component: Home },
    { path: 'login', component: Login },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
];
