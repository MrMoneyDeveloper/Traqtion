import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PersonService, Person } from '../services/persons.service';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-person-create',
  templateUrl: './person-create.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PersonCreateComponent {
  person: Person = {
    idNumber: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    accounts: []
  };

  errorMessage: string = '';
  isSubmitting: boolean = false;

  constructor(private personService: PersonService, private router: Router) { }

  save(form: NgForm): void {
    this.errorMessage = '';

    if (form.invalid) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this.isSubmitting = true;

    this.personService.createPerson(this.person).subscribe({
      next: () => this.router.navigate(['/persons']),
      error: (err: any) => {
        this.isSubmitting = false;
        this.errorMessage = err?.error || 'Failed to create person.';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/persons']);
  }
}
