import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';

export interface LoginResponse {
  token: string;
  // Extend with optional fields: username?: string, roles?: string[], etc.
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:5001/api';
  private readonly tokenKey = 'token';
  private readonly useSessionStorage = true; // Toggle between session/local

  constructor(private http: HttpClient) { }

  /**
   * Logs in user by sending credentials to the backend.
   * Matches .NET PascalCase expectations.
   */
  login(username: string, password: string): Observable<LoginResponse> {
    const payload = { Username: username, Password: password };

    console.debug('[AuthService] Sending login request:', payload);

    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, payload).pipe(
      tap(res => {
        if (res?.token) {
          this.storeToken(res.token);
          console.debug('[AuthService] Login successful. Token stored.');
        } else {
          console.warn('[AuthService] Login response missing token.');
        }
      }),
      catchError(err => {
        const msg = err?.error?.message || 'Invalid credentials or network issue';
        console.error('[AuthService] Login failed:', msg);
        return throwError(() => new Error(msg));
      })
    );
  }

  /**
   * Logs the user out by clearing token.
   */
  logout(): void {
    this.clearToken();
    console.info('[AuthService] User logged out. Token removed.');
  }

  /**
   * Checks if a token is present, indicating authentication.
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Retrieves the stored JWT token.
   */
  getToken(): string | null {
    return this.useSessionStorage
      ? sessionStorage.getItem(this.tokenKey)
      : localStorage.getItem(this.tokenKey);
  }

  /**
   * Stores the token using chosen storage strategy.
   */
  private storeToken(token: string): void {
    if (this.useSessionStorage) {
      sessionStorage.setItem(this.tokenKey, token);
    } else {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  /**
   * Clears the stored token.
   */
  private clearToken(): void {
    sessionStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.tokenKey);
  }

  /**
   * Optional future: Decode JWT (requires jwt-decode package)
   */
  // decodeToken(): any {
  //   const token = this.getToken();
  //   if (!token) return null;
  //   return jwtDecode(token);
  // }
}
