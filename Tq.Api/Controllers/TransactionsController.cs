using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tq.Api.Data;
using Tq.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Tq.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TransactionsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/transactions
        [HttpGet]
        public ActionResult<IEnumerable<Transaction>> GetTransactions()
        {
            var transactions = _context.Transactions
                .Include(t => t.Account)
                .ToList();
            return Ok(transactions);
        }

        // GET: api/transactions/{id}
        [HttpGet("{id}")]
        public ActionResult<Transaction> GetTransaction(int id)
        {
            var transaction = _context.Transactions
                .Include(t => t.Account)
                .FirstOrDefault(t => t.TransactionId == id);

            if (transaction == null)
                return NotFound("Transaction not found.");

            return Ok(transaction);
        }

        // POST: api/transactions
        [HttpPost]
        public IActionResult CreateTransaction([FromBody] Transaction model)
        {
            // Validate transaction date is not in the future.
            if (model.TransactionDate.Date > DateTime.Today)
                return BadRequest("Transaction date cannot be in the future.");

            // Validate non-zero transaction amount.
            if (model.Amount == 0)
                return BadRequest("Transaction amount cannot be zero.");

            // Always set the CaptureDate to the current time.
            model.GetType().GetProperty("CaptureDate")?.SetValue(model, DateTime.Now);

            // Check that the account exists.
            var account = _context.Accounts.FirstOrDefault(a => a.AccountId == model.AccountId);
            if (account == null)
                return BadRequest("Account does not exist.");

            // Prevent transactions on a closed account.
            if (account.Status == AccountStatus.Closed)
                return BadRequest("Cannot add transactions to a closed account.");

            // Insert transaction.
            _context.Transactions.Add(model);

            // Update account balance using credit/debit logic.
            decimal newBalance = account.OutstandingBalance;
            if (model.Type.Equals("Credit", StringComparison.OrdinalIgnoreCase))
            {
                newBalance += model.Amount;
            }
            else if (model.Type.Equals("Debit", StringComparison.OrdinalIgnoreCase))
            {
                newBalance -= model.Amount;
            }
            else
            {
                return BadRequest("Transaction Type must be 'Debit' or 'Credit'.");
            }

            account.GetType().GetProperty("OutstandingBalance")?.SetValue(account, newBalance);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetTransaction), new { id = model.TransactionId }, model);
        }

        // PUT: api/transactions/{id}
        [HttpPut("{id}")]
        public IActionResult UpdateTransaction(int id, [FromBody] Transaction updated)
        {
            var transaction = _context.Transactions
                .Include(t => t.Account)
                .FirstOrDefault(t => t.TransactionId == id);

            if (transaction == null)
                return NotFound("Transaction not found.");

            var account = transaction.Account;
            if (account == null)
                return BadRequest("Transaction is linked to no account.");

            // Prevent updates if the account is closed.
            if (account.Status == AccountStatus.Closed)
                return BadRequest("Cannot modify a transaction on a closed account.");

            // Validate new transaction date.
            if (updated.TransactionDate.Date > DateTime.Today)
                return BadRequest("Transaction date cannot be in the future.");

            // Revert the impact of the existing transaction on the account balance.
            decimal newBalance = account.OutstandingBalance;
            if (transaction.Type.Equals("Credit", StringComparison.OrdinalIgnoreCase))
                newBalance -= transaction.Amount;
            else if (transaction.Type.Equals("Debit", StringComparison.OrdinalIgnoreCase))
                newBalance += transaction.Amount;

            // Update transaction fields.
            transaction.TransactionDate = updated.TransactionDate;
            transaction.Description = updated.Description;
            transaction.Type = updated.Type;
            transaction.Amount = updated.Amount;
            transaction.GetType().GetProperty("CaptureDate")?.SetValue(transaction, DateTime.Now);

            // Reapply new transaction impact.
            if (transaction.Type.Equals("Credit", StringComparison.OrdinalIgnoreCase))
                newBalance += transaction.Amount;
            else if (transaction.Type.Equals("Debit", StringComparison.OrdinalIgnoreCase))
                newBalance -= transaction.Amount;
            else
                return BadRequest("Transaction Type must be 'Debit' or 'Credit'.");

            account.GetType().GetProperty("OutstandingBalance")?.SetValue(account, newBalance);
            _context.SaveChanges();

            return Ok(transaction);
        }

        // DELETE: api/transactions/{id}
        [HttpDelete("{id}")]
        public IActionResult DeleteTransaction(int id)
        {
            var transaction = _context.Transactions
                .Include(t => t.Account)
                .FirstOrDefault(t => t.TransactionId == id);

            if (transaction == null)
                return NotFound("Transaction not found.");

            var account = transaction.Account;
            if (account == null)
                return BadRequest("Transaction is linked to no account.");

            // Prevent deletion if the account is closed.
            if (account.Status == AccountStatus.Closed)
                return BadRequest("Cannot delete transaction from a closed account.");

            // Adjust account balance before deletion.
            decimal newBalance = account.OutstandingBalance;
            if (transaction.Type.Equals("Credit", StringComparison.OrdinalIgnoreCase))
                newBalance -= transaction.Amount;
            else if (transaction.Type.Equals("Debit", StringComparison.OrdinalIgnoreCase))
                newBalance += transaction.Amount;

            _context.Transactions.Remove(transaction);
            account.GetType().GetProperty("OutstandingBalance")?.SetValue(account, newBalance);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
