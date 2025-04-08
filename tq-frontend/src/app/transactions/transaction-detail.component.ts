import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { TransactionService, Transaction } from '../services/transaction.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-transaction-detail',
  standalone: true,
  templateUrl: './transaction-detail.component.html',
  imports: [CommonModule, FormsModule, RouterModule]
})
export class TransactionDetailsComponent implements OnInit {
  transaction: Transaction = {
    transactionId: 0,
    accountId: 0,
    transactionDate: '',
    type: 'Credit',
    amount: 0,
    description: '',
    captureDate: ''
  };

  isNew = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private transactionService: TransactionService
  ) { }

  ngOnInit(): void {
    const txnIdParam = this.route.snapshot.paramMap.get('id');
    const acctIdQuery = this.route.snapshot.queryParamMap.get('accountId');

    if (txnIdParam && txnIdParam !== 'new') {
      const txnId = Number(txnIdParam);
      if (isNaN(txnId) || txnId <= 0) {
        this.errorMessage = 'Invalid transaction ID.';
        return;
      }
      this.isNew = false;
      // Load existing transaction
      this.transactionService.getTransaction(txnId).subscribe({
        next: (data: Transaction | undefined) => {
          if (data) {
            this.transaction = data;
          } else {
            this.errorMessage = 'Transaction not found.';
          }
        },
        error: (err) => {
          console.error('Failed to load transaction', err);
          this.errorMessage = 'Failed to load transaction data.';
        }
      });
    } else {
      // Setup for new transaction
      this.transaction.transactionDate = new Date().toISOString().split('T')[0]; // default to today
      if (acctIdQuery) {
        const parsedId = Number(acctIdQuery);
        if (!isNaN(parsedId) && parsedId > 0) {
          this.transaction.accountId = parsedId;
        }
      }
    }
  }

  save(form: NgForm): void {
    if (form.invalid) return;
    // Set capture date/time for new or updated transaction
    this.transaction.captureDate = new Date().toISOString();
    let request$: Observable<Transaction>;
    const txnId = this.transaction.transactionId;

    if (this.isNew) {
      request$ = this.transactionService.createTransaction(this.transaction);
    } else if (txnId !== undefined && txnId > 0) {
      request$ = this.transactionService.updateTransaction(txnId, this.transaction);
    } else {
      this.errorMessage = 'Invalid transaction ID for update.';
      return;
    }

    request$.subscribe({
      next: () => this.navigateAfterSave(),
      error: (err) => {
        console.error('Save error:', err);
        this.errorMessage = err?.error || 'Failed to save transaction.';
      }
    });
  }

  cancel(): void {
    this.navigateAfterSave();
  }

  private navigateAfterSave(): void {
    const id = this.transaction.accountId;
    if (typeof id === 'number' && id > 0) {
      this.router.navigate(['/accounts', id]);
    } else {
      this.router.navigate(['/persons']);
    }
  }
}
