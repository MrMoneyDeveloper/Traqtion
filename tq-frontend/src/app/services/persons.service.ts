import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Person {
  personId?: number;
  idNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  accounts?: any[];
  accountsCount?: number; // added to support template binding
}

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private apiUrl = environment.apiUrl;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getPersons(): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.apiUrl}/persons`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getPerson(id: number): Observable<Person> {
    return this.http.get<Person>(`${this.apiUrl}/persons/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  createPerson(person: Person): Observable<Person> {
    return this.http.post<Person>(`${this.apiUrl}/persons`, person, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updatePerson(id: number, person: Person): Observable<Person> {
    return this.http.put<Person>(`${this.apiUrl}/persons/${id}`, person, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  deletePerson(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/persons/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  searchPersons(term: string): Observable<Person[]> {
    const encoded = encodeURIComponent(term.trim());
    return this.http.get<Person[]>(`${this.apiUrl}/persons/search?term=${encoded}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('PersonService error:', error);
    const errorMsg = error.error instanceof ErrorEvent
      ? `Client-side error: ${error.error.message}`
      : `Server error (${error.status}): ${error.message}`;
    return throwError(() => new Error(errorMsg));
  }
}
