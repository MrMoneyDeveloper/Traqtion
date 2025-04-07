import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
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

  // Optional: Define common HTTP options (headers, etc.)
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // Retrieve all persons
  getPersons(): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.apiUrl}/persons`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // Retrieve a person by ID
  getPerson(id: number): Observable<Person> {
    return this.http.get<Person>(`${this.apiUrl}/persons/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // Create a new person record
  createPerson(person: Person): Observable<Person> {
    return this.http.post<Person>(`${this.apiUrl}/persons`, person, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // Update an existing person record
  updatePerson(id: number, person: Person): Observable<Person> {
    return this.http.put<Person>(`${this.apiUrl}/persons/${id}`, person, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // Delete a person record
  deletePerson(id: number): Observable<{}> {
    return this.http.delete(`${this.apiUrl}/persons/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // Search persons by a term (ID, surname, or account number)
  searchPersons(term: string): Observable<Person[]> {
    if (!term.trim()) {
      // If no term provided, return all persons.
      return this.getPersons();
    }
    const encodedTerm = encodeURIComponent(term);
    return this.http.get<Person[]>(`${this.apiUrl}/persons/search?term=${encodedTerm}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // Generic error handling for HTTP requests.
  private handleError(error: HttpErrorResponse) {
    console.error('PersonService error:', error);
    let errorMsg = 'An error occurred; please try again later.';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error.
      errorMsg = `A client-side error occurred: ${error.error.message}`;
    } else {
      // Backend returned unsuccessful response code.
      errorMsg = `Server returned code ${error.status}, error message is: ${error.message}`;
    }
    return throwError(() => new Error(errorMsg));
  }
}
