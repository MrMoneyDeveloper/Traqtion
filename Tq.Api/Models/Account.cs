using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace Tq.Api.Models
{
    [Index(nameof(AccountNumber), IsUnique = true)]
    public class Account : IValidatableObject
    {
        [Key]
        public int AccountId { get; set; }

        [Required, MaxLength(20)]
        public string AccountNumber { get; set; } = string.Empty;

        // The account's current status; defaults to Open.
        public AccountStatus Status { get; set; } = AccountStatus.Open;

        // OutstandingBalance is updated only via business logic, not directly by the user.
        public decimal OutstandingBalance { get; private set; } = 0m;

        // New accounts must be linked to an existing Person.
        [Required]
        public int PersonId { get; set; }

        [Required]
        public Person Person { get; set; } = default!;

        // An account may have an unlimited number of transactions.
        public List<Transaction> Transactions { get; set; } = new();

        /// <summary>
        /// Custom validation to ensure that an account cannot be closed unless its outstanding balance is zero.
        /// </summary>
        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (Status == AccountStatus.Closed && OutstandingBalance != 0m)
            {
                yield return new ValidationResult(
                    "An account cannot be closed when the outstanding balance is not zero.",
                    new[] { nameof(Status), nameof(OutstandingBalance) }
                );
            }
        }
    }

    public enum AccountStatus
    {
        Open,
        Closed
    }
}
