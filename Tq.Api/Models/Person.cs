using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Tq.Api.Models
{
    public class Person
    {

        public int PersonId { get; set; }

        [Required, MaxLength(13)]
        public string IdNumber { get; set; } = string.Empty; // non-null default

        [Required, MaxLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [Required, MaxLength(50)]
        public string LastName { get; set; } = string.Empty;

        public DateTime DateOfBirth { get; set; }

        // Navigation
        public List<Account> Accounts { get; set; } = new();
    }

}

