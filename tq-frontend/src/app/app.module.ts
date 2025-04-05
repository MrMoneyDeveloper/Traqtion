import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // 2)
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PersonsListComponent } from './persons/persons-list.component';
import { PersonDetailComponent } from './persons/person-detail.component';
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'persons', component: PersonsListComponent },
  { path: 'persons/:id', component: PersonDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    PersonsListComponent,
    PersonDetailComponent // Add PersonDetailComponent to declarations
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes) // Use RouterModule.forRoot(routes) instead of AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent] // The root component to bootstrap
})
export class AppModule { }
