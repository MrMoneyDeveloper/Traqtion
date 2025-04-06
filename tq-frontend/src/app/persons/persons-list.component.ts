import { Component, OnInit } from '@angular/core';
import { PersonService, Person } from './persons.service';

@Component({
  selector: 'app-persons-list',
  templateUrl: './persons-list.component.html'
})
export class PersonsListComponent implements OnInit {
  persons: Person[] = [];
  searchTerm: string = '';

  constructor(private personService: PersonService) { }

  ngOnInit(): void {
    this.loadPersons();
  }

  // Load all persons
  loadPersons(): void {
    this.personService.getPersons().subscribe({
      next: (data: Person[]) => {
        this.persons = data;
      },
      error: (err: any) => console.error('Error loading persons:', err)
    });
  }

  // Delete a person after confirmation
  deletePerson(personId: number): void {
    if (!confirm('Are you sure you want to delete this person?')) {
      return;
    }
    this.personService.deletePerson(personId).subscribe({
      next: () => this.loadPersons(),
      error: (err: any) => alert(err.error || 'Error deleting person')
    });
  }

  // Search persons by ID, surname, or account number
  onSearch(): void {
    const term = this.searchTerm.trim();
    if (!term) {
      // If no search term is provided, reload all persons
      this.loadPersons();
      return;
    }
    this.personService.searchPersons(term).subscribe({
      next: (data: Person[]) => {
        this.persons = data;
      },
      error: (err: any) => console.error('Error searching persons:', err)
    });
  }
}
