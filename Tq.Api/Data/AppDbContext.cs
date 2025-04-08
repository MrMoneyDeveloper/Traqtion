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

            // --- Person Configuration ---
            modelBuilder.Entity<Person>()
                .HasIndex(p => p.IdNumber)
                .IsUnique();

            // --- Account Configuration ---
            modelBuilder.Entity<Account>()
                .HasIndex(a => a.AccountNumber)
                .IsUnique();

            modelBuilder.Entity<Account>()
                .HasIndex(a => a.PersonId); // For performance on joins/filtering

            modelBuilder.Entity<Account>()
                .Property(a => a.Status)
                .HasConversion<string>(); // Enum to string

            // --- Transaction Configuration ---
            modelBuilder.Entity<Transaction>()
                .HasIndex(t => t.AccountId); // For performance on joins/filtering

            modelBuilder.Entity<Transaction>()
                .Property(t => t.Amount)
                .HasPrecision(18, 2); // Set decimal precision

            modelBuilder.Entity<Transaction>()
                .Property(t => t.CaptureDate)
                .HasDefaultValueSql("GETDATE()"); // SQL default if not explicitly set
        }
    }
}
