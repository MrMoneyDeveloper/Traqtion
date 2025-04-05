using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tq.Api.Data;
using Tq.Api.Models;

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
            // Include Accounts (and Transactions if you want)
            var persons = _context.Persons
                                  .Include(p => p.Accounts)
                                  .ThenInclude(a => a.Transactions)
                                  .ToList();
            return Ok(persons);
        }

        // GET: api/persons/5
        [HttpGet("{id}")]
        public ActionResult<Person> GetPerson(int id)
        {
            var person = _context.Persons
                                 .Include(p => p.Accounts)
                                 .ThenInclude(a => a.Transactions)
                                 .FirstOrDefault(x => x.PersonId == id);
            if (person == null)
                return NotFound();

            return Ok(person);
        }

        // POST: api/persons
        [HttpPost]
        public IActionResult CreatePerson([FromBody] Person person)
        {
            if (_context.Persons.Any(p => p.IdNumber == person.IdNumber))
            {
                return BadRequest("A person with this ID number already exists.");
            }

            _context.Persons.Add(person);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetPerson), new { id = person.PersonId }, person);
        }

        // PUT: api/persons/5
        [HttpPut("{id}")]
        public IActionResult UpdatePerson(int id, [FromBody] Person updated)
        {
            var existing = _context.Persons.Find(id);
            if (existing == null)
                return NotFound();

            // Update fields
            existing.FirstName = updated.FirstName;
            existing.LastName = updated.LastName;
            existing.IdNumber = updated.IdNumber;
            existing.DateOfBirth = updated.DateOfBirth;

            _context.SaveChanges();
            return Ok(existing);
        }

        // DELETE: api/persons/5
        [HttpDelete("{id}")]
        public IActionResult DeletePerson(int id)
        {
            var person = _context.Persons
                                 .Include(p => p.Accounts)
                                 .FirstOrDefault(x => x.PersonId == id);

            if (person == null)
                return NotFound();

            // Rule: can only delete if no open accounts
            if (person.Accounts.Any(a => a.Status == AccountStatus.Open))
            {
                return BadRequest("Cannot delete a person who has open accounts.");
            }

            _context.Persons.Remove(person);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
