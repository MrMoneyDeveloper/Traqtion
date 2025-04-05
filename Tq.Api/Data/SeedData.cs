using Tq.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Tq.Api.Data
{
    public static class SeedData
    {
        public static void Initialize(AppDbContext context)
        {
            // If we have at least one Person, assume DB is seeded
            if (context.Persons.Any())
                return;

            // Seed persons
            var p1 = new Person
            {
                IdNumber = "9001011234087",
                FirstName = "Alice",
                LastName = "Smith",
                DateOfBirth = new DateTime(1990, 1, 1),
            };

            var p2 = new Person
            {
                IdNumber = "8505057654321",
                FirstName = "Bob",
                LastName = "Jones",
                DateOfBirth = new DateTime(1985, 5, 5),
            };
            context.Persons.AddRange(p1, p2);
            context.SaveChanges();

            // Seed an account for Alice
            var acct = new Account
            {
                AccountNumber = "ACC1001",
                PersonId = p1.PersonId,
                // initial balance = 0
            };
            context.Accounts.Add(acct);
            context.SaveChanges();

            // Seed a transaction
            var txn = new Transaction
            {
                AccountId = acct.AccountId,
                Amount = 1000m,
                Type = "Credit",
                TransactionDate = DateTime.Today,
                Description = "Initial deposit"
            };
            // Manually set capture date (private set).
            txn.GetType().GetProperty("CaptureDate")?.SetValue(txn, DateTime.Now);

            context.Transactions.Add(txn);
            // update balance in code
            acct.GetType().GetProperty("OutstandingBalance")?.SetValue(acct, 1000m);
            context.SaveChanges();

            // Seed a test user
            var user = new User
            {
                Username = "admin",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin")
            };
            context.Users.Add(user);
            context.SaveChanges();
        }
    }
}
