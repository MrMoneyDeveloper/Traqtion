using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace Tq.Api.Models
{
    [Index(nameof(IdNumber), IsUnique = true)]
    public class Person
    {
        [Key]
        public int PersonId { get; set; }

        [Required, MaxLength(13)]
        public string IdNumber { get; set; } = string.Empty;

        [Required, MaxLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [Required, MaxLength(50)]
        public string LastName { get; set; } = string.Empty;

        public DateTime DateOfBirth { get; set; }

        // Navigation property: A person can have an unlimited number of accounts.
        public List<Account> Accounts { get; set; } = new();

        /// <summary>
        /// Indicates whether the person can be deleted.
        /// A person is deletable only if they have no accounts, or all of their accounts are closed.
        /// </summary>
        public bool CanBeDeleted()
        {
            return Accounts == null || Accounts.Count == 0 || Accounts.All(a => a.Status == AccountStatus.Closed);
        }
    }
}
