using Microsoft.EntityFrameworkCore; // Important
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Tq.Api.Models
{
    [Index(nameof(AccountNumber), IsUnique = true)] // or do the fluent approach in OnModelCreating
    public class Account
    {
        public int AccountId { get; set; }

        [Required, MaxLength(20)]
        public string AccountNumber { get; set; } = string.Empty;

        public AccountStatus Status { get; set; } = AccountStatus.Open;

        public decimal OutstandingBalance { get; private set; } = 0m;

        // Relationship
        public int PersonId { get; set; }
        public Person Person { get; set; } = default!;

        public List<Transaction> Transactions { get; set; } = new();
    }

    public enum AccountStatus
    {
        Open,
        Closed
    }
}
