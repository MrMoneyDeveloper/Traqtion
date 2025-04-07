using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tq.Api.Data;
using Tq.Api.Models;
using System.Collections.Generic;
using System.Linq;

namespace Tq.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PersonsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public PersonsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/persons
        [HttpGet]
        public ActionResult<IEnumerable<Person>> GetPersons()
        {
            // Include Accounts and their Transactions
            var persons = _context.Persons
                                  .Include(p => p.Accounts)
                                  .ThenInclude(a => a.Transactions)
                                  .ToList();
            return Ok(persons);
        }

        // GET: api/persons/{id}
        [HttpGet("{id}")]
        public ActionResult<Person> GetPerson(int id)
        {
            var person = _context.Persons
                                 .Include(p => p.Accounts)
                                 .ThenInclude(a => a.Transactions)
                                 .FirstOrDefault(x => x.PersonId == id);
            if (person == null)
                return NotFound("Person not found.");

            return Ok(person);
        }

        // POST: api/persons
        [HttpPost]
        public IActionResult CreatePerson([FromBody] Person person)
        {
            // Check for unique ID Number.
            if (_context.Persons.Any(p => p.IdNumber == person.IdNumber))
            {
                return BadRequest("A person with this ID number already exists.");
            }

            _context.Persons.Add(person);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetPerson), new { id = person.PersonId }, person);
        }

        // PUT: api/persons/{id}
        [HttpPut("{id}")]
        public IActionResult UpdatePerson(int id, [FromBody] Person updated)
        {
            var existing = _context.Persons.Find(id);
            if (existing == null)
                return NotFound("Person not found.");

            // Update person details.
            // Note: Updating IdNumber should also be validated for uniqueness if allowed.
            existing.FirstName = updated.FirstName;
            existing.LastName = updated.LastName;
            existing.IdNumber = updated.IdNumber;
            existing.DateOfBirth = updated.DateOfBirth;

            _context.SaveChanges();
            return Ok(existing);
        }

        // DELETE: api/persons/{id}
        [HttpDelete("{id}")]
        public IActionResult DeletePerson(int id)
        {
            var person = _context.Persons
                                 .Include(p => p.Accounts)
                                 .FirstOrDefault(x => x.PersonId == id);

            if (person == null)
                return NotFound("Person not found.");

            // Use the model's CanBeDeleted helper to enforce deletion rules.
            if (!person.CanBeDeleted())
            {
                return BadRequest("Cannot delete a person with open accounts.");
            }

            _context.Persons.Remove(person);
            _context.SaveChanges();
            return NoContent();
        }

        // GET: api/persons/search?term=...
        [HttpGet("search")]
        public ActionResult<IEnumerable<Person>> SearchPersons([FromQuery] string term)
        {
            if (string.IsNullOrEmpty(term))
            {
                return Ok(_context.Persons
                    .Include(p => p.Accounts)
                    .ToList());
            }

            term = term.ToLower();
            // Search in IdNumber, LastName, or within related Accounts by AccountNumber.
            var results = _context.Persons
                .Include(p => p.Accounts)
                .Where(p =>
                    p.IdNumber.ToLower().Contains(term) ||
                    p.LastName.ToLower().Contains(term) ||
                    p.Accounts.Any(a => a.AccountNumber.ToLower().Contains(term))
                ).ToList();

            return Ok(results);
        }
    }
}
