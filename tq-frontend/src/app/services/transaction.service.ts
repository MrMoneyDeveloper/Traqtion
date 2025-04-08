import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Transaction {
  transactionId: number;
  accountId: number;
  transactionDate: string;
  type: string;
  amount: number;
  description: string;
  captureDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = environment.apiUrl;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getTransaction(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/transactions/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  createTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/transactions`, transaction, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateTransaction(id: number, transaction: Transaction): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.apiUrl}/transactions/${id}`, transaction, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/transactions/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // New method to retrieve transactions by account
  getTransactionsByAccount(accountId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/transactions/by-account/${accountId}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('TransactionService error:', error);
    const errorMsg = error.error instanceof ErrorEvent
      ? `Client-side error: ${error.error.message}`
      : `Server error (${error.status}): ${error.message}`;
    return throwError(() => new Error(errorMsg));
  }
}
