import { Component, OnInit } from '@angular/core';
import { PersonService, Person } from './persons.service';

@Component({
  selector: 'app-persons-list',
  templateUrl: './persons-list.component.html'
})
export class PersonsListComponent implements OnInit {
  persons: Person[] = [];

  constructor(private personService: PersonService) { }

  ngOnInit(): void {
    this.loadPersons();
  }

  loadPersons(): void {
    this.personService.getPersons().subscribe({
      next: (data: Person[]) => this.persons = data,
      error: (err: any) => console.error(err)
    });
  }

  deletePerson(personId: number): void {
    if (!confirm('Are you sure you want to delete this person?')) return;
    this.personService.deletePerson(personId).subscribe({
      next: () => this.loadPersons(),
      error: (err: any) => alert(err.error || 'Error deleting person')
    });
  }
}
