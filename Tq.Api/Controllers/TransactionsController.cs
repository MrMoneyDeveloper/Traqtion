using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tq.Api.Data;
using Tq.Api.Models;

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
            var txns = _context.Transactions
                .Include(t => t.Account)
                .ToList();
            return Ok(txns);
        }

        // GET: api/transactions/5
        [HttpGet("{id}")]
        public ActionResult<Transaction> GetTransaction(int id)
        {
            var txn = _context.Transactions
                .Include(t => t.Account)
                .FirstOrDefault(t => t.TransactionId == id);
            if (txn == null)
                return NotFound();

            return Ok(txn);
        }

        // POST: api/transactions
        [HttpPost]
        public IActionResult CreateTransaction([FromBody] Transaction model)
        {
            // Check account
            var account = _context.Accounts
                .FirstOrDefault(a => a.AccountId == model.AccountId);

            if (account == null)
                return BadRequest("Account does not exist.");

            // If account is Closed, block new transactions
            if (account.Status == AccountStatus.Closed)
                return BadRequest("Cannot add transactions to a closed account.");

            // Validate transaction date
            if (model.TransactionDate.Date > DateTime.Today)
                return BadRequest("Transaction date cannot be in the future.");

            if (model.Amount == 0)
                return BadRequest("Amount cannot be zero.");

            // Set capture date
            model.GetType().GetProperty("CaptureDate")?.SetValue(model, DateTime.Now);

            // Insert transaction
            _context.Transactions.Add(model);

            // Update account balance
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

            // Save changes
            account.GetType().GetProperty("OutstandingBalance")?.SetValue(account, newBalance);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetTransaction), new { id = model.TransactionId }, model);
        }

        // PUT: api/transactions/5
        [HttpPut("{id}")]
        public IActionResult UpdateTransaction(int id, [FromBody] Transaction updated)
        {
            var txn = _context.Transactions
                .Include(t => t.Account)
                .FirstOrDefault(t => t.TransactionId == id);

            if (txn == null)
                return NotFound("Transaction not found.");

            var account = txn.Account;
            if (account == null)
                return BadRequest("Transaction is linked to no account.");

            // If account closed, no updates allowed
            if (account.Status == AccountStatus.Closed)
                return BadRequest("Cannot modify a transaction on a closed account.");

            // Validate new date
            if (updated.TransactionDate.Date > DateTime.Today)
                return BadRequest("Transaction date cannot be in the future.");

            // Revert old amount
            decimal newBalance = account.OutstandingBalance;
            if (txn.Type.Equals("Credit", StringComparison.OrdinalIgnoreCase))
                newBalance -= txn.Amount;
            else
                newBalance += txn.Amount;

            // Now apply new type & amount
            txn.TransactionDate = updated.TransactionDate;
            txn.Description = updated.Description;
            txn.Type = updated.Type;
            txn.Amount = updated.Amount;

            // Reset capture date to "now"
            txn.GetType().GetProperty("CaptureDate")?.SetValue(txn, DateTime.Now);

            // Re-apply updated type/amount
            if (txn.Type.Equals("Credit", StringComparison.OrdinalIgnoreCase))
                newBalance += txn.Amount;
            else if (txn.Type.Equals("Debit", StringComparison.OrdinalIgnoreCase))
                newBalance -= txn.Amount;
            else
                return BadRequest("Transaction Type must be 'Debit' or 'Credit'.");

            // Save to DB
            account.GetType().GetProperty("OutstandingBalance")?.SetValue(account, newBalance);
            _context.SaveChanges();

            return Ok(txn);
        }

        // DELETE: api/transactions/5
        [HttpDelete("{id}")]
        public IActionResult DeleteTransaction(int id)
        {
            var txn = _context.Transactions
                .Include(t => t.Account)
                .FirstOrDefault(t => t.TransactionId == id);

            if (txn == null)
                return NotFound();

            var account = txn.Account!;
            // If closed, cannot remove old transactions. (Up to your business rules).
            if (account.Status == AccountStatus.Closed)
                return BadRequest("Cannot delete transaction from a closed account.");

            // Adjust account balance
            decimal newBalance = account.OutstandingBalance;
            if (txn.Type.Equals("Credit", StringComparison.OrdinalIgnoreCase))
                newBalance -= txn.Amount;
            else
                newBalance += txn.Amount;

            _context.Transactions.Remove(txn);
            account.GetType().GetProperty("OutstandingBalance")?.SetValue(account, newBalance);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
