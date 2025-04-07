import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonService, Person } from '../services/persons.service';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-person-edit',
  templateUrl: './person-edit.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PersonEditComponent implements OnInit {
  person: Person = {
    personId: 0,
    idNumber: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    accounts: []
  };

  errorMessage: string = '';
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private personService: PersonService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const personId = idParam && !isNaN(+idParam) ? +idParam : null;

    if (!personId) {
      this.errorMessage = 'Invalid or missing person ID.';
      this.isLoading = false;
      return;
    }

    this.personService.getPerson(personId).subscribe({
      next: (data: Person) => {
        this.person = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load person data.';
        this.isLoading = false;
      }
    });
  }

  save(form: NgForm): void {
    if (form.invalid) return;

    this.personService.updatePerson(this.person.personId!, this.person).subscribe({
      next: () => this.router.navigate(['/persons']),
      error: err => {
        this.errorMessage = err?.error || 'Failed to update person.';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/persons']);
  }
}
