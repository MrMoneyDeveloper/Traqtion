using System.ComponentModel.DataAnnotations;

namespace Tq.Api.Models
{
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
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
