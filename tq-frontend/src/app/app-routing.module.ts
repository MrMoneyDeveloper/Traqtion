import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { PersonsListComponent } from './persons/persons-list.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  // Public Routes
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },

  // Protected Person Routes
  {
    path: 'persons',
    component: PersonsListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'persons/details/:id',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./persons/person-detail.component').then(m => m.PersonDetailComponent)
  },
  {
    path: 'persons/edit/:id',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./persons/person-edit.component').then(m => m.PersonEditComponent)
  },
  {
    path: 'persons/create',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./persons/person-create.component').then(m => m.PersonCreateComponent)
  },

  // Fallback and Redirects
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
