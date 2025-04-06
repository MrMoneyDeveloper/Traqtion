import { Component, OnInit } from '@angular/core';
import { PersonService, Person } from './persons.service';

@Component({
  selector: 'app-persons-list',
  templateUrl: './persons-list.component.html',
  standalone: false,
})
export class PersonsListComponent implements OnInit {
  // Array to hold the list of persons retrieved from the API
  persons: Person[] = [];
  // The current search term entered by the user
  searchTerm: string = '';

  constructor(private personService: PersonService) { }

  ngOnInit(): void {
    this.loadPersons();
  }

  /**
   * Retrieves all persons from the API and updates the local persons array.
   */
  loadPersons(): void {
    this.personService.getPersons().subscribe({
      next: (data: Person[]) => this.persons = data,
      error: (err: any) => console.error('Error loading persons:', err)
    });
  }

  /**
   * Deletes a person after user confirmation.
   * @param personId - The ID of the person to delete.
   */
  deletePerson(personId: number): void {
    if (!confirm('Are you sure you want to delete this person?')) {
      return;
    }
    this.personService.deletePerson(personId).subscribe({
      next: () => this.loadPersons(),
      error: (err: any) => alert(err.error || 'Error deleting person')
    });
  }

  /**
   * Searches for persons based on a search term.
   * If the term is empty, it reloads the complete list.
   */
  onSearch(): void {
    const term = this.searchTerm.trim();
    if (!term) {
      this.loadPersons();
      return;
    }
    this.personService.searchPersons(term).subscribe({
      next: (data: Person[]) => this.persons = data,
      error: (err: any) => console.error('Error searching persons:', err)
    });
  }
}
