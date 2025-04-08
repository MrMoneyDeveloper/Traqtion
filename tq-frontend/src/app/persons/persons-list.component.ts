import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonService, Person } from '../services/persons.service';

@Component({
  selector: 'app-persons-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './persons-list.component.html',
})
export class PersonsListComponent implements OnInit {
  persons: Person[] = [];
  searchTerm = '';
  currentPage = 1;
  pageSize = 5;
  isLoading = false;
  errorMessage = '';

  constructor(
    private personService: PersonService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadPersons();
  }

  loadPersons(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.personService.getPersons().subscribe({
      next: (data: Person[]) => {
        this.persons = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Error loading persons. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    if (!this.searchTerm.trim()) {
      this.loadPersons();
    }
    // If there is a search term, the list will filter automatically via filteredPersons()
  }

  filteredPersons(): Person[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.persons;
    return this.persons.filter(p =>
      (p.idNumber?.toLowerCase().includes(term) ?? false) ||
      (p.lastName?.toLowerCase().includes(term) ?? false) ||
      (p.accounts?.some(acc => acc.accountNumber?.toLowerCase().includes(term)) ?? false)
    );
  }

  pagedPersons(): Person[] {
    const filtered = this.filteredPersons();
    const start = (this.currentPage - 1) * this.pageSize;
    return filtered.slice(start, start + this.pageSize);
  }

  totalPages(): number[] {
    const total = Math.ceil(this.filteredPersons().length / this.pageSize);
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages().length) {
      this.currentPage = page;
    }
  }

  createPerson(): void {
    this.router.navigate(['/persons/create']);
  }

  editPerson(personId: number | undefined): void {
    if (this.isValidId(personId)) {
      this.router.navigate(['/persons/edit', personId]);
    } else {
      alert('Invalid person ID for edit.');
    }
  }

  viewDetails(personId: number | undefined): void {
    if (this.isValidId(personId)) {
      this.router.navigate(['/persons/details', personId]);
    } else {
      alert('Invalid person ID for details.');
    }
  }

  deletePerson(personId: number | undefined): void {
    if (!this.isValidId(personId)) {
      alert('Invalid person ID for deletion.');
      return;
    }
    if (!confirm('Are you sure you want to delete this person?')) return;
    this.personService.deletePerson(personId).subscribe({
      next: () => {
        // Remove the deleted person from the list
        this.persons = this.persons.filter(p => p.personId !== personId);
      },
      error: (err) => {
        const msg = err?.error || 'Could not delete person. Possible open accounts or internal error.';
        alert(`Delete failed: ${msg}`);
      }
    });
  }

  private isValidId(id: number | undefined): id is number {
    return typeof id === 'number' && id > 0;
  }
}
