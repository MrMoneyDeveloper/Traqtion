import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { PersonService, Person } from '../services/persons.service';

@Component({
  selector: 'app-person-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './person-detail.component.html'
})
export class PersonDetailsComponent implements OnInit {
  person: Person = {
    personId: 0,
    idNumber: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    accounts: []  // Ensure accounts is always defined (initialized to empty array)
  };

  isLoading = false;
  errorMessage = '';
  editMode = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private personService: PersonService
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'new') {
      const parsedId = Number(idParam);
      if (!Number.isFinite(parsedId) || parsedId <= 0) {
        this.errorMessage = 'Invalid person ID.';
        return;
      }
      this.isLoading = true;
      this.personService.getPerson(parsedId).subscribe({
        next: (data: Person | undefined) => {
          if (data) {
            // Guarantee that accounts is always defined (use empty array if undefined)
            this.person = { ...data, accounts: data.accounts ?? [] };
            this.editMode = true;
          } else {
            this.errorMessage = 'Person not found.';
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to load person:', err);
          this.errorMessage = 'Failed to load person data.';
          this.isLoading = false;
        }
      });
    } else {
      // "new" person route
      this.editMode = true;
    }
  }

  save(form: NgForm): void {
    if (form.invalid) return;
    if (this.person.personId !== undefined && this.person.personId > 0) {
      const id = this.person.personId;
      this.personService.updatePerson(id, this.person).subscribe({
        next: () => this.router.navigate(['/persons']),
        error: (err) => {
          console.error('Failed to save person:', err);
          this.errorMessage = err?.error || 'Failed to save person.';
        }
      });
    } else {
      this.personService.createPerson(this.person).subscribe({
        next: () => this.router.navigate(['/persons']),
        error: (err) => {
          console.error('Failed to save person:', err);
          this.errorMessage = err?.error || 'Failed to save person.';
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/persons']);
  }

  addAccount(): void {
    const id = this.person.personId;
    if (typeof id === 'number' && id > 0) {
      this.router.navigate(['/accounts/new'], {
        queryParams: { personId: id }
      });
    } else {
      alert('Cannot add account: Invalid person ID.');
    }
  }

  editAccount(accountId: number | undefined): void {
    if (accountId !== undefined && accountId > 0) {
      this.router.navigate(['/accounts/edit', accountId]);
    } else {
      alert('Invalid account ID.');
    }
  }

  goBack(): void {
    this.router.navigate(['/persons']);
  }
}
