import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Added for animations
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PersonsListComponent } from './persons/persons-list.component';

// Import standalone components (do not declare them)
import { PersonDetailComponent } from './persons/person-detail.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'persons', component: PersonsListComponent, canActivate: [AuthGuard] },
  { path: 'persons/:id', component: PersonDetailComponent, canActivate: [AuthGuard] },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    PersonsListComponent
    // Do NOT declare PersonDetailComponent, AboutComponent, or ContactComponent if they are standalone.
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,  // Added for Angular animations
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
    // Import standalone components here
    PersonDetailComponent,
    AboutComponent,
    ContactComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
