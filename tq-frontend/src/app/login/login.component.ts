import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onLogin(): void {
    if (this.isLoading || !this.username || !this.password) return;

    this.errorMessage = '';
    this.isLoading = true;

    console.debug('[LoginComponent] Attempting login for user:', this.username);

    this.authService.login(this.username, this.password).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (res) => {
        console.debug('[LoginComponent] Login successful:', res);
        // Consistent with AuthService (sessionStorage-based)
        sessionStorage.setItem('token', res.token || '');
        this.router.navigate(['/persons']);
      },
      error: (err) => {
        console.error('[LoginComponent] Login failed:', err);
        this.errorMessage = err.message || 'Login failed. Please check your credentials.';
      }
    });
  }
}
