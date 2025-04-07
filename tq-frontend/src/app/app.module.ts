import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module'; // ✅ Correct path
import { AuthGuard } from './guards/auth.guard';

// Core App Components (non-standalone)
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PersonsListComponent } from './persons/persons-list.component';

// Standalone Components (must be imported, not declared)
import { LogoutComponent } from './logout/logout.component';
import { PersonDetailComponent } from './persons/person-detail.component';
import { PersonCreateComponent } from './persons/person-create.component';
import { PersonEditComponent } from './persons/person-edit.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    PersonsListComponent
    // 🚫 Do not declare standalone components
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,

    // ✅ Standalone component imports
    LogoutComponent,
    PersonDetailComponent,
    PersonCreateComponent,
    PersonEditComponent,
    AboutComponent,
    ContactComponent
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
