import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Person {
  personId: number;
  idNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  accounts: any[];
}

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Retrieve all persons
  getPersons(): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.apiUrl}/persons`)
      .pipe(catchError(this.handleError));
  }

  // Retrieve a person by ID
  getPerson(id: number): Observable<Person> {
    return this.http.get<Person>(`${this.apiUrl}/persons/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Create a new person record
  createPerson(person: Person): Observable<Person> {
    return this.http.post<Person>(`${this.apiUrl}/persons`, person)
      .pipe(catchError(this.handleError));
  }

  // Update an existing person record
  updatePerson(id: number, person: Person): Observable<any> {
    return this.http.put(`${this.apiUrl}/persons/${id}`, person)
      .pipe(catchError(this.handleError));
  }

  // Delete a person record
  deletePerson(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/persons/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Search persons by a term (ID, surname, or account number)
  searchPersons(term: string): Observable<Person[]> {
    if (!term.trim()) {
      // if no term provided, return all persons
      return this.getPersons();
    }
    const encodedTerm = encodeURIComponent(term);
    return this.http.get<Person[]>(`${this.apiUrl}/persons/search?term=${encodedTerm}`)
      .pipe(catchError(this.handleError));
  }

  // Basic error handling method for HTTP requests
  private handleError(error: HttpErrorResponse) {
    console.error('PersonService error:', error);
    // Customize error message if needed.
    return throwError(() => new Error('An error occurred; please try again later.'));
  }
}
