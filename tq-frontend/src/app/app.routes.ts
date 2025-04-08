import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'logout',
    loadComponent: () => import('./logout/logout.component').then(m => m.LogoutComponent)
  },
  {
    path: 'persons',
    loadComponent: () => import('./persons/persons-list.component').then(m => m.PersonsListComponent)
  }
  // Add other lazy-loaded components as needed
];
