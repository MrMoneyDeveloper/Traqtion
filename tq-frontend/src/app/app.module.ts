import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './guards/auth.guard';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { PersonsListComponent } from './persons/persons-list.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { PersonDetailsComponent } from './persons/person-detail.component';
import { AccountDetailsComponent } from './accounts/account-detail.component';
import { TransactionDetailsComponent } from './transactions/transaction-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PersonsListComponent,
    LoginComponent,
    LogoutComponent,
    AboutComponent,
    ContactComponent,
    PersonDetailsComponent,
    AccountDetailsComponent,
    TransactionDetailsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
