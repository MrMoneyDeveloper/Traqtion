using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore; // Needed for the Index attribute

namespace Tq.Api.Models
{
    [Index(nameof(Username), IsUnique = true)]
    public class User
    {
        public int UserId { get; set; }

        [Required, MaxLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;
    }

    public class LoginRequest
    {
        [Required, MaxLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }
}
