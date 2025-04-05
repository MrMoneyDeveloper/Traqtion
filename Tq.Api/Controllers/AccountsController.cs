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
        public ActionResult<IEnumerable<Account>> GetAccounts()
        {
            var accounts = _context.Accounts
                .Include(a => a.Person)
                .Include(a => a.Transactions)
                .ToList();
            return Ok(accounts);
        }

        // GET: api/accounts/5
        [HttpGet("{id}")]
        public ActionResult<Account> GetAccount(int id)
        {
            var account = _context.Accounts
                .Include(a => a.Person)
                .Include(a => a.Transactions)
                .FirstOrDefault(a => a.AccountId == id);

            if (account == null)
                return NotFound();

            return Ok(account);
        }

        // POST: api/accounts
        [HttpPost]
        public IActionResult CreateAccount([FromBody] Account account)
        {
            // Check Person exists
            var person = _context.Persons.Find(account.PersonId);
            if (person == null)
                return BadRequest("Person does not exist.");

            // Unique check for AccountNumber
            if (_context.Accounts.Any(a => a.AccountNumber == account.AccountNumber))
                return BadRequest("AccountNumber already in use.");

            // Balance is always 0 on creation, ignoring any inbound attempt
            account.GetType().GetProperty("OutstandingBalance")?.SetValue(account, 0m);

            _context.Accounts.Add(account);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetAccount), new { id = account.AccountId }, account);
        }

        // PUT: api/accounts/5
        [HttpPut("{id}")]
        public IActionResult UpdateAccount(int id, [FromBody] Account updated)
        {
            var existing = _context.Accounts
                .Include(a => a.Person)
                .FirstOrDefault(a => a.AccountId == id);

            if (existing == null)
                return NotFound();

            // Possibly let user change only status or rename account number etc.
            // If you do NOT allow changing AccountNumber after creation, skip it:
            existing.Status = updated.Status;
            // We do NOT allow direct changes to OutstandingBalance
            // existing.OutstandingBalance = existing.OutstandingBalance;  // no-op

            _context.SaveChanges();
            return Ok(existing);
        }

        // DELETE: api/accounts/5
        [HttpDelete("{id}")]
        public IActionResult DeleteAccount(int id)
        {
            var account = _context.Accounts.Find(id);
            if (account == null)
                return NotFound();

            _context.Accounts.Remove(account);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
