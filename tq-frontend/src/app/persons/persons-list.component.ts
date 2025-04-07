import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PersonService, Person } from '../services/persons.service';

@Component({
  selector: 'app-persons-list',
  templateUrl: './persons-list.component.html',
  standalone: false,
})
export class PersonsListComponent implements OnInit {
  persons: Person[] = [];
  searchTerm: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private personService: PersonService, private router: Router) { }

  ngOnInit(): void {
    this.loadPersons();
  }

  loadPersons(): void {
    this.errorMessage = '';
    this.isLoading = true;
    this.personService.getPersons().subscribe({
      next: (data: Person[]) => {
        this.persons = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = 'Error loading persons. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  deletePerson(personId: number): void {
    if (!confirm('Are you sure you want to delete this person?')) return;

    this.personService.deletePerson(personId).subscribe({
      next: () => this.loadPersons(),
      error: (err: any) => alert(err.error || 'Error deleting person')
    });
  }

  onSearch(): void {
    this.errorMessage = '';
    const term = this.searchTerm.trim();
    if (!term) {
      this.loadPersons();
      return;
    }
    this.isLoading = true;
    this.personService.searchPersons(term).subscribe({
      next: (data: Person[]) => {
        this.persons = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = 'Error searching persons. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  editPerson(personId: number): void {
    this.router.navigate(['/persons', personId]);
  }

  createPerson(): void {
    this.router.navigate(['/persons/create']);
  }
}
