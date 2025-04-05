import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Person {
  personId: number;
  idNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  accounts: any[];
}

@Injectable({ providedIn: 'root' })
export class PersonService {
  private apiUrl = 'https://localhost:5001/api';

  constructor(private http: HttpClient) { }

  getPersons(): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.apiUrl}/persons`);
  }

  getPerson(id: number): Observable<Person> {
    return this.http.get<Person>(`${this.apiUrl}/persons/${id}`);
  }

  createPerson(person: Person): Observable<Person> {
    return this.http.post<Person>(`${this.apiUrl}/persons`, person);
  }

  updatePerson(id: number, person: Person): Observable<any> {
    return this.http.put(`${this.apiUrl}/persons/${id}`, person);
  }

  deletePerson(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/persons/${id}`);
  }
}
