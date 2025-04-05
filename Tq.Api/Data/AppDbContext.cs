using Microsoft.EntityFrameworkCore;
using Tq.Api.Models;

namespace Tq.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<Person> Persons { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Example: Unique index for Person.IdNumber
            modelBuilder.Entity<Person>()
                .HasIndex(p => p.IdNumber)
                .IsUnique(true);

            // Unique index for Account.AccountNumber
            modelBuilder.Entity<Account>()
                .HasIndex(a => a.AccountNumber)
                .IsUnique(true);

            // If using an enum, map it to string or int
            modelBuilder.Entity<Account>()
                .Property(a => a.Status)
                .HasConversion<string>();
        }
    }
}
