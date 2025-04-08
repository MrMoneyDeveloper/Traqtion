import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AccountService, Account } from '../services/account.service';
import { TransactionService, Transaction } from '../services/transaction.service';
import { PersonService } from '../services/persons.service';

@Component({
  selector: 'app-account-detail',
  standalone: true,
  templateUrl: './account-detail.component.html',
  imports: [CommonModule, FormsModule, RouterModule]
})
export class AccountDetailsComponent implements OnInit {
  account: Account = {
    accountId: 0,
    accountNumber: '',
    personId: 0,
    status: 'Open',
    outstandingBalance: 0
  };

  transactions: Transaction[] = [];
  personName: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private transactionService: TransactionService,
    private personService: PersonService
  ) { }

  ngOnInit(): void {
    const acctId = this.route.snapshot.paramMap.get('id');
    const personIdQuery = this.route.snapshot.queryParamMap.get('personId');

    if (acctId && acctId !== 'new') {
      const accountId = Number(acctId);
      if (isNaN(accountId) || accountId <= 0) {
        this.errorMessage = 'Invalid account ID.';
        return;
      }

      this.isLoading = true;
      this.accountService.getAccount(accountId).subscribe({
        next: (data: Account) => {
          this.account = data;
          this.isLoading = false;
          this.loadPerson(data.personId);
          // Use the correct method name from TransactionService:
          this.loadTransactions(accountId);
        },
        error: (err: any) => {
          this.errorMessage = 'Failed to load account data.';
          this.isLoading = false;
        }
      });
    } else if (personIdQuery) {
      const personId = Number(personIdQuery);
      if (!isNaN(personId) && personId > 0) {
        this.account.personId = personId;
        this.loadPerson(personId);
      }
    }
  }

  private loadPerson(personId: number): void {
    if (isNaN(personId) || personId <= 0) return;
    this.personService.getPerson(personId).subscribe({
      next: (p) => this.personName = `${p.firstName} ${p.lastName}`,
      error: (err: any) => console.error('Failed to load person name', err)
    });
  }

  private loadTransactions(accountId: number): void {
    this.transactionService.getTransactionsByAccount(accountId).subscribe({
      next: (txns: Transaction[]) => this.transactions = txns,
      error: (err: any) => console.error('Failed to load transactions', err)
    });
  }

  save(form: NgForm): void {
    if (form.invalid) return;
    const request$ = (this.account.accountId !== undefined && this.account.accountId > 0)
      ? this.accountService.updateAccount(this.account.accountId!, this.account)
      : this.accountService.createAccount(this.account);
    request$.subscribe({
      next: () => this.navigateAfterSave(),
      error: (err: any) => this.errorMessage = err?.error || 'Failed to save account.'
    });
  }

  cancel(): void {
    this.navigateAfterSave();
  }

  private navigateAfterSave(): void {
    this.router.navigate(['/persons', (this.account.personId || 0).toString()]);
  }

  addTransaction(): void {
    this.router.navigate(['/transactions/new'], {
      queryParams: { accountId: this.account.accountId }
    });
  }
}
