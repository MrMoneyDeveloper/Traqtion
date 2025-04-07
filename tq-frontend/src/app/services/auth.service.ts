import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginResponse {
  token: string;
  // Additional properties can be added here if needed.
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Base URL for your API; adjust as needed.
  private apiUrl = 'http://localhost:5001/api';

  constructor(private http: HttpClient) { }

  /**
   * Performs login by sending credentials to the backend.
   * Returns an Observable emitting a typed LoginResponse.
   * On success, the token is automatically stored in sessionStorage.
   */
  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap(response => {
          // Store the token in sessionStorage for session-based authentication.
          sessionStorage.setItem('token', response.token);
        })
      );
  }

  /**
   * Logs out the current user by removing the stored token.
   */
  logout(): void {
    sessionStorage.removeItem('token');
  }

  /**
   * Checks if the user is authenticated by verifying the presence of a token.
   */
  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('token');
  }

  /**
   * Retrieves the stored authentication token.
   */
  getToken(): string | null {
    return sessionStorage.getItem('token');
  }
}
