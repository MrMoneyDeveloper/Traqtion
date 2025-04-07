using Microsoft.EntityFrameworkCore;
using Tq.Api.Models;

namespace Tq.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Person> Persons { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Unique index for Person.IdNumber.
            modelBuilder.Entity<Person>()
                .HasIndex(p => p.IdNumber)
                .IsUnique();

            // Unique index for Account.AccountNumber.
            modelBuilder.Entity<Account>()
                .HasIndex(a => a.AccountNumber)
                .IsUnique();

            // Map the AccountStatus enum to its string representation.
            modelBuilder.Entity<Account>()
                .Property(a => a.Status)
                .HasConversion<string>();

            // Configure decimal precision for Transaction.Amount.
            modelBuilder.Entity<Transaction>()
                .Property(t => t.Amount)
                .HasPrecision(18, 2);

            // Set a default value for Transaction.CaptureDate using SQL (if not set by code).
            modelBuilder.Entity<Transaction>()
                .Property(t => t.CaptureDate)
                .HasDefaultValueSql("GETDATE()");
        }
    }
}
