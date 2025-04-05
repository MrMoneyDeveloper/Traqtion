using System.ComponentModel.DataAnnotations;

namespace Tq.Api.Models
{
    public class Transaction
    {
        public int TransactionId { get; set; }

        public int AccountId { get; set; }
        public Account Account { get; set; } = default!;

        [Required]
        public decimal Amount { get; set; }

        [Required]
        public string Type { get; set; } = string.Empty; // "Debit" or "Credit"

        // Must not be in the future
        [Required]
        public DateTime TransactionDate { get; set; }

        public DateTime CaptureDate { get; private set; }

        public string Description { get; set; } = string.Empty;
    }
}
