import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { PersonsListComponent } from './persons/persons-list.component';
import { PersonDetailsComponent } from './persons/person-detail.component';
import { AccountDetailsComponent } from './accounts/account-detail.component';
import { TransactionDetailsComponent } from './transactions/transaction-detail.component';
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
  { path: 'persons', component: PersonsListComponent, canActivate: [AuthGuard] },
  { path: 'persons/new', component: PersonDetailsComponent, canActivate: [AuthGuard] },
  { path: 'persons/:id', component: PersonDetailsComponent, canActivate: [AuthGuard] },

  // Protected Account Routes
  { path: 'accounts/new', component: AccountDetailsComponent, canActivate: [AuthGuard] },
  { path: 'accounts/:id', component: AccountDetailsComponent, canActivate: [AuthGuard] },

  // Protected Transaction Routes
  { path: 'transactions/new', component: TransactionDetailsComponent, canActivate: [AuthGuard] },
  { path: 'transactions/:id', component: TransactionDetailsComponent, canActivate: [AuthGuard] },

  // Fallback & Redirects
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
