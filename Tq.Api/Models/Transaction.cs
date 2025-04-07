using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Tq.Api.Models
{
    public class Transaction : IValidatableObject
    {
        [Key]
        public int TransactionId { get; set; }

        [Required]
        public int AccountId { get; set; }

        [Required]
        public Account Account { get; set; } = default!;

        // The transaction amount must be greater than zero.
        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Transaction amount must be greater than zero.")]
        public decimal Amount { get; set; }

        // Transaction type must be either "Debit" or "Credit".
        [Required]
        [RegularExpression("^(Debit|Credit)$", ErrorMessage = "Transaction type must be either 'Debit' or 'Credit'.")]
        public string Type { get; set; } = string.Empty;

        // The transaction date must not be in the future.
        [Required]
        public DateTime TransactionDate { get; set; }

        // CaptureDate is set automatically by the system and cannot be modified by the user.
        public DateTime CaptureDate { get; private set; }

        public string Description { get; set; } = string.Empty;

        /// <summary>
        /// Custom validation to ensure the TransactionDate is not in the future.
        /// </summary>
        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (TransactionDate.Date > DateTime.Today)
            {
                yield return new ValidationResult("Transaction date cannot be in the future.", new[] { nameof(TransactionDate) });
            }
        }
    }
}
