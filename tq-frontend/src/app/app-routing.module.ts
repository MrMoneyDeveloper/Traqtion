import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { PersonsListComponent } from './persons/persons-list.component';
import { PersonDetailsComponent } from './persons/person-detail.component';
import { AccountDetailsComponent } from './accounts/account-detail.component';
import { TransactionDetailsComponent } from './transactions/transaction-detail.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },

  { path: 'persons', component: PersonsListComponent, canActivate: [AuthGuard] },
  { path: 'persons/create', component: PersonDetailsComponent, canActivate: [AuthGuard] },
  { path: 'persons/edit/:id', component: PersonDetailsComponent, canActivate: [AuthGuard] },
  { path: 'persons/details/:id', component: PersonDetailsComponent, canActivate: [AuthGuard] },

  { path: 'accounts/new', component: AccountDetailsComponent, canActivate: [AuthGuard] },
  { path: 'accounts/edit/:id', component: AccountDetailsComponent, canActivate: [AuthGuard] },
  { path: 'accounts/:id', component: AccountDetailsComponent, canActivate: [AuthGuard] },

  { path: 'transactions/new', component: TransactionDetailsComponent, canActivate: [AuthGuard] },
  { path: 'transactions/:id', component: TransactionDetailsComponent, canActivate: [AuthGuard] },

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
