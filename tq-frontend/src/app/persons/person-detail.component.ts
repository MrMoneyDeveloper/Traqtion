import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PersonService, Person } from '../services/persons.service';

@Component({
  selector: 'app-person-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <div *ngIf="isLoading" class="alert alert-info">Loading person details...</div>
      <div *ngIf="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
      <div *ngIf="person && !isLoading">
        <h2>{{ person.firstName }} {{ person.lastName }}</h2>
        <p><strong>ID Number:</strong> {{ person.idNumber }}</p>
        <p><strong>Date of Birth:</strong> {{ person.dateOfBirth | date }}</p>
        <h3>Accounts</h3>
        <ul>
          <li *ngFor="let account of person.accounts">
            {{ account.accountNumber }} - Status: {{ account.status }} - 
            Balance: {{ account.outstandingBalance | currency }}
          </li>
        </ul>
        <button class="btn btn-secondary" (click)="goBack()">Back to List</button>
      </div>
    </div>
  `
})
export class PersonDetailComponent implements OnInit {
  person: Person | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private personService: PersonService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadPerson();
  }

  loadPerson(): void {
    this.isLoading = true;
    const idParam = this.route.snapshot.paramMap.get('id');
    const personId = Number(idParam);

    if (!personId || isNaN(personId)) {
      this.errorMessage = 'Invalid person ID provided.';
      this.isLoading = false;
      return;
    }

    this.personService.getPerson(personId).subscribe({
      next: (data) => {
        this.person = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading person details:', err);
        this.errorMessage = 'Error loading person details. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/persons']);
  }
}
