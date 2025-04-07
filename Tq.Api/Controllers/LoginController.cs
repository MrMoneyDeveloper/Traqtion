using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tq.Api.Data;
using Tq.Api.Models; // Use the models defined in Tq.Api.Models

namespace Tq.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly AppDbContext _context;
        public LoginController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            // Model validation is automatically handled by [ApiController],
            // but we can still check ModelState if needed.
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Find user by username (using case-insensitive comparison)
            var user = _context.Users.FirstOrDefault(u => u.Username.ToLower() == request.Username.ToLower());
            if (user == null)
                return Unauthorized("Invalid username or password.");

            // Verify the provided password against the stored hash.
            bool validPassword = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
            if (!validPassword)
                return Unauthorized("Invalid username or password.");

            // For Phase 1, return a fake token placeholder.
            return Ok(new { Token = "fake-jwt-token" });
        }
    }
}
