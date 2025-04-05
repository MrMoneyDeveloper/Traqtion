import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
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
        />
      </div>
      <button 
        class="btn btn-primary"
        type="submit"
        [disabled]="loginForm.invalid"
      >
        Login
      </button>
    </form>
    <div *ngIf="errorMessage" class="text-danger mt-2">
      {{ errorMessage }}
    </div>
  `
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private http: HttpClient) { }

  onLogin() {
    // For Phase 1, call POST /api/login with { username, password }
    this.http.post<any>('https://localhost:5001/api/login', {
      username: this.username,
      password: this.password
    }).subscribe({
      next: (res) => {
        // store token or do something
        localStorage.setItem('token', res.token || '');
        this.errorMessage = '';
        alert('Logged in successfully!');
      },
      error: (err) => {
        this.errorMessage = err.error || 'Invalid credentials';
      }
    });
  }
}
