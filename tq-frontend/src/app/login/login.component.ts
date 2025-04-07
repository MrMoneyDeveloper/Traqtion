import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  template: `
    <h2>Login</h2>
    <form (ngSubmit)="onLogin()" #loginForm="ngForm">
      <div class="mb-3">
        <label for="username" class="form-label">Username</label>
        <input 
          id="username"
          name="username"
          [(ngModel)]="username" 
          class="form-control"
          required 
          [disabled]="isLoading"
        />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input 
          id="password"
          name="password"
          type="password"
          [(ngModel)]="password" 
          class="form-control"
          required 
          [disabled]="isLoading"
        />
      </div>
      <button 
        class="btn btn-primary"
        type="submit"
        [disabled]="loginForm.invalid || isLoading"
      >
        Login
      </button>
    </form>
    <div *ngIf="errorMessage" class="text-danger mt-2">
      {{ errorMessage }}
    </div>
    <div *ngIf="isLoading" class="mt-2">
      Loading...
    </div>
  `
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) { }

  onLogin(): void {
    this.errorMessage = '';
    this.isLoading = true;
    // Call the AuthService to perform login.
    this.authService.login(this.username, this.password).subscribe({
      next: (res) => {
        // On success, store token and navigate to the protected route.
        localStorage.setItem('token', res.token || '');
        this.router.navigate(['/persons']);
      },
      error: (err) => {
        // Try to extract a meaningful error message.
        this.errorMessage = err.error ? (err.error.message || err.error) : 'Invalid credentials';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
