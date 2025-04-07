using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tq.Api.Data;
using Tq.Api.Models;

namespace Tq.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AccountsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/accounts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Account>>> GetAccounts()
        {
            var accounts = await _context.Accounts
                .Include(a => a.Person)
                .Include(a => a.Transactions)
                .ToListAsync();
            return Ok(accounts);
        }

        // GET: api/accounts/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Account>> GetAccount(int id)
        {
            var account = await _context.Accounts
                .Include(a => a.Person)
                .Include(a => a.Transactions)
                .FirstOrDefaultAsync(a => a.AccountId == id);

            if (account == null)
                return NotFound("Account not found.");

            return Ok(account);
        }

        // POST: api/accounts
        [HttpPost]
        public async Task<IActionResult> CreateAccount([FromBody] Account account)
        {
            // Verify that the Person exists.
            var person = await _context.Persons.FindAsync(account.PersonId);
            if (person == null)
                return BadRequest("Person does not exist.");

            // Ensure the AccountNumber is unique.
            if (await _context.Accounts.AnyAsync(a => a.AccountNumber == account.AccountNumber))
                return BadRequest("Account number already in use.");

            // New accounts always start with an outstanding balance of 0.
            account.GetType().GetProperty("OutstandingBalance")?.SetValue(account, 0m);

            _context.Accounts.Add(account);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAccount), new { id = account.AccountId }, account);
        }

        // PUT: api/accounts/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAccount(int id, [FromBody] Account updated)
        {
            var existing = await _context.Accounts
                .Include(a => a.Person)
                .FirstOrDefaultAsync(a => a.AccountId == id);

            if (existing == null)
                return NotFound("Account not found.");

            // If AccountNumber is updated, ensure uniqueness.
            if (!existing.AccountNumber.Equals(updated.AccountNumber, StringComparison.OrdinalIgnoreCase))
            {
                if (await _context.Accounts.AnyAsync(a => a.AccountNumber == updated.AccountNumber))
                    return BadRequest("Account number already in use.");
                existing.AccountNumber = updated.AccountNumber;
            }

            // Update account status.
            // If changing to Closed, ensure OutstandingBalance is zero.
            if (updated.Status == AccountStatus.Closed && existing.OutstandingBalance != 0m)
                return BadRequest("Cannot close account when the outstanding balance is not zero.");

            existing.Status = updated.Status;

            // Note: OutstandingBalance is not updated directly.
            await _context.SaveChangesAsync();
            return Ok(existing);
        }

        // DELETE: api/accounts/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAccount(int id)
        {
            var account = await _context.Accounts.FindAsync(id);
            if (account == null)
                return NotFound("Account not found.");

            // Optionally ensure the account balance is zero before deletion.
            if (account.OutstandingBalance != 0m)
                return BadRequest("Cannot delete an account with a non-zero outstanding balance.");

            _context.Accounts.Remove(account);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
