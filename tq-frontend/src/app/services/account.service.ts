import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Account {
  accountId?: number;
  accountNumber: string;
  personId: number;
  status: string;
  outstandingBalance: number;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = environment.apiUrl;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.apiUrl}/accounts`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getAccount(accountId: number): Observable<Account> {
    return this.http.get<Account>(`${this.apiUrl}/accounts/${accountId}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getAccountsByPerson(personId: number): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.apiUrl}/accounts/by-person/${personId}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  createAccount(account: Account): Observable<Account> {
    return this.http.post<Account>(`${this.apiUrl}/accounts`, account, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateAccount(accountId: number, account: Account): Observable<Account> {
    return this.http.put<Account>(`${this.apiUrl}/accounts/${accountId}`, account, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteAccount(accountId: number): Observable<{}> {
    return this.http.delete(`${this.apiUrl}/accounts/${accountId}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('AccountService error:', error);
    let errorMsg = 'An unexpected error occurred.';
    if (error.error instanceof ErrorEvent) {
      errorMsg = `Client-side error: ${error.error.message}`;
    } else {
      errorMsg = `Server error (${error.status}): ${error.message}`;
    }
    return throwError(() => new Error(errorMsg));
  }
}
