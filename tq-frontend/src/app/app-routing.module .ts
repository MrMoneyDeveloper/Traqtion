import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component'; // new component for logout
import { PersonsListComponent } from './persons/persons-list.component';
import { PersonDetailComponent } from './persons/person-detail.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent }, // dedicated logout route
  { path: 'persons', component: PersonsListComponent, canActivate: [AuthGuard] },
  { path: 'persons/:id', component: PersonDetailComponent, canActivate: [AuthGuard] },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  // Default route
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  // Wildcard route for handling unknown URLs
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
