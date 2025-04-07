import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Person {
  personId?: number;  // Optional for new person creation
  idNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  accounts?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private apiUrl = environment.apiUrl;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
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

  deletePerson(id: number): Observable<{}> {
    return this.http.delete(`${this.apiUrl}/persons/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  searchPersons(term: string): Observable<Person[]> {
    if (!term.trim()) {
      return this.getPersons();
    }
    const encodedTerm = encodeURIComponent(term);
    return this.http.get<Person[]>(`${this.apiUrl}/persons/search?term=${encodedTerm}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('PersonService error:', error);
    let errorMsg = 'An error occurred; please try again later.';
    if (error.error instanceof ErrorEvent) {
      errorMsg = `Client-side error: ${error.error.message}`;
    } else {
      errorMsg = `Server returned code ${error.status}, error: ${error.message}`;
    }
    return throwError(() => new Error(errorMsg));
  }
}
