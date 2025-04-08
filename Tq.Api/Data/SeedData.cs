using Microsoft.EntityFrameworkCore;
using Tq.Api.Models;

namespace Tq.Api.Data
{
    public static class SeedData
    {
        public static void Initialize(AppDbContext context)
        {
            // --- 0. Clear out existing data ---
            context.Database.ExecuteSqlRaw("DELETE FROM Transactions");
            context.Database.ExecuteSqlRaw("DELETE FROM Accounts");
            context.Database.ExecuteSqlRaw("DELETE FROM Persons");
            context.SaveChanges();

            // 1. Insert fixed Person records
            var p1 = new Person { IdNumber = "9001011234087", FirstName = "Alice", LastName = "Smith", DateOfBirth = new DateTime(1990, 1, 1) };
            var p2 = new Person { IdNumber = "8505057654321", FirstName = "Bob", LastName = "Jones", DateOfBirth = new DateTime(1985, 5, 5) };
            var p3 = new Person { IdNumber = "9203031111111", FirstName = "Charlie", LastName = "Brown", DateOfBirth = new DateTime(1992, 3, 3) };
            var p4 = new Person { IdNumber = "9304042222222", FirstName = "Diana", LastName = "Prince", DateOfBirth = new DateTime(1993, 4, 4) };
            var p5 = new Person { IdNumber = "9405053333333", FirstName = "Ethan", LastName = "Hunt", DateOfBirth = new DateTime(1994, 5, 5) };
            var p6 = new Person { IdNumber = "9506064444444", FirstName = "Fiona", LastName = "Gallagher", DateOfBirth = new DateTime(1995, 6, 6) };
            var p7 = new Person { IdNumber = "9607075555555", FirstName = "George", LastName = "Michael", DateOfBirth = new DateTime(1996, 7, 7) };
            var p8 = new Person { IdNumber = "9708086666666", FirstName = "Hannah", LastName = "Montana", DateOfBirth = new DateTime(1997, 8, 8) };
            var p9 = new Person { IdNumber = "9809097777777", FirstName = "Ian", LastName = "Curtis", DateOfBirth = new DateTime(1998, 9, 9) };
            var p10 = new Person { IdNumber = "9910108888888", FirstName = "Julia", LastName = "Roberts", DateOfBirth = new DateTime(1999, 10, 10) };
            var p11 = new Person { IdNumber = "0011119999999", FirstName = "Kevin", LastName = "Spacey", DateOfBirth = new DateTime(2000, 11, 11) };
            var p12 = new Person { IdNumber = "0112120000000", FirstName = "Laura", LastName = "Palmer", DateOfBirth = new DateTime(2001, 12, 12) };
            context.Persons.AddRange(p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12);
            context.SaveChanges();

            // Seed account for Alice
            var acct = new Account { AccountNumber = "ACC1001", PersonId = p1.PersonId };
            context.Accounts.Add(acct);
            context.SaveChanges();

            var txn = new Transaction
            {
                AccountId = acct.AccountId,
                Amount = 1000m,
                Type = "Credit",
                TransactionDate = DateTime.Today,
                Description = "Initial deposit"
            };
            txn.GetType().GetProperty("CaptureDate")?.SetValue(txn, DateTime.Now);
            context.Transactions.Add(txn);
            acct.GetType().GetProperty("OutstandingBalance")?.SetValue(acct, 1000m);
            context.SaveChanges();

            // --- Stored Procedure Creation ---
            string dropRandomDataProc = @"IF OBJECT_ID('sp_PopulateRandomData', 'P') IS NOT NULL DROP PROCEDURE sp_PopulateRandomData;";
            context.Database.ExecuteSqlRaw(dropRandomDataProc);

            string createRandomDataProc = @"CREATE PROCEDURE sp_PopulateRandomData @NumRecords INT = 1 AS BEGIN SET NOCOUNT ON; DECLARE @i INT = 1; WHILE @i <= @NumRecords BEGIN INSERT INTO Persons (IdNumber, FirstName, LastName, DateOfBirth) VALUES (RIGHT('0000000000000' + CAST(ABS(CHECKSUM(NEWID())) % 10000000000000 AS VARCHAR(13)), 13), 'First' + CAST(@i AS VARCHAR(2)), 'Last' + CAST(@i AS VARCHAR(2)), DATEADD(year, -((ABS(CHECKSUM(NEWID())) % 60) + 18), GETDATE())); DECLARE @PersonId INT = SCOPE_IDENTITY(); INSERT INTO Accounts (AccountNumber, PersonId, Status, OutstandingBalance) VALUES ('ACC' + CAST(1000 + @i AS VARCHAR(10)), @PersonId, 'Open', 0); DECLARE @AccountId INT = SCOPE_IDENTITY(); DECLARE @NumTxns INT = (ABS(CHECKSUM(NEWID())) % 5) + 1; DECLARE @j INT = 1; WHILE @j <= @NumTxns BEGIN DECLARE @Type VARCHAR(10) = CASE WHEN (ABS(CHECKSUM(NEWID())) % 2) = 0 THEN 'Credit' ELSE 'Debit' END; DECLARE @Amount DECIMAL(18,2) = CAST((ABS(CHECKSUM(NEWID())) % 1000) + 50 AS DECIMAL(18,2)); INSERT INTO Transactions (AccountId, Amount, Type, TransactionDate, Description, CaptureDate) VALUES (@AccountId, @Amount, @Type, DATEADD(day, - (ABS(CHECKSUM(NEWID())) % 30), GETDATE()), 'Random Transaction ' + CAST(@j AS VARCHAR(2)), GETDATE()); IF @Type = 'Credit' UPDATE Accounts SET OutstandingBalance = OutstandingBalance + @Amount WHERE AccountId = @AccountId; ELSE UPDATE Accounts SET OutstandingBalance = OutstandingBalance - @Amount WHERE AccountId = @AccountId; SET @j = @j + 1; END SET @i = @i + 1; END END";
            context.Database.ExecuteSqlRaw(createRandomDataProc);

            string dropAddAccountsProc = @"IF OBJECT_ID('sp_AddAccountsAndTransactionsForExistingPersons', 'P') IS NOT NULL DROP PROCEDURE sp_AddAccountsAndTransactionsForExistingPersons;";
            context.Database.ExecuteSqlRaw(dropAddAccountsProc);

            string createAddAccountsProc = @"CREATE PROCEDURE sp_AddAccountsAndTransactionsForExistingPersons AS BEGIN SET NOCOUNT ON; DECLARE @PersonId INT; DECLARE person_cursor CURSOR FOR SELECT PersonId FROM Persons; OPEN person_cursor; FETCH NEXT FROM person_cursor INTO @PersonId; WHILE @@FETCH_STATUS = 0 BEGIN DECLARE @NumAccounts INT = (ABS(CHECKSUM(NEWID())) % 5) + 2; DECLARE @acc INT = 1; WHILE @acc <= @NumAccounts BEGIN DECLARE @AccountNumber VARCHAR(20) = 'ACC' + CAST(ABS(CHECKSUM(NEWID())) % 999999 AS VARCHAR); INSERT INTO Accounts (AccountNumber, PersonId, Status, OutstandingBalance) VALUES (@AccountNumber, @PersonId, 'Open', 0); DECLARE @AccountId INT = SCOPE_IDENTITY(); DECLARE @NumTxns INT = (ABS(CHECKSUM(NEWID())) % 5) + 2; DECLARE @txn INT = 1; WHILE @txn <= @NumTxns BEGIN DECLARE @Amount DECIMAL(18,2) = CAST((ABS(CHECKSUM(NEWID())) % 1000) + 10 AS DECIMAL(18,2)); DECLARE @Type VARCHAR(10) = CASE WHEN (ABS(CHECKSUM(NEWID())) % 2 = 0) THEN 'Credit' ELSE 'Debit' END; INSERT INTO Transactions (AccountId, Amount, Type, TransactionDate, Description, CaptureDate) VALUES (@AccountId, @Amount, @Type, DATEADD(DAY, - (ABS(CHECKSUM(NEWID())) % 30), GETDATE()), 'Generated Txn', GETDATE()); IF @Type = 'Credit' UPDATE Accounts SET OutstandingBalance = OutstandingBalance + @Amount WHERE AccountId = @AccountId; ELSE UPDATE Accounts SET OutstandingBalance = OutstandingBalance - @Amount WHERE AccountId = @AccountId; SET @txn = @txn + 1; END SET @acc = @acc + 1; END FETCH NEXT FROM person_cursor INTO @PersonId; END CLOSE person_cursor; DEALLOCATE person_cursor; END";
            context.Database.ExecuteSqlRaw(createAddAccountsProc);

            // Execute stored procedure to populate accounts and transactions
            context.Database.ExecuteSqlRaw("EXEC sp_AddAccountsAndTransactionsForExistingPersons");

            int currentPersonCount = context.Persons.Count();
            if (currentPersonCount < 12)
            {
                int numToInsert = 12 - currentPersonCount;
                context.Database.ExecuteSqlRaw("EXEC sp_PopulateRandomData @NumRecords = {0}", numToInsert);
            }

            if (!context.Users.Any(u => u.Username.ToLower() == "admin"))
            {
                var adminUser = new User { Username = "admin", PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin") };
                context.Users.Add(adminUser);
                context.SaveChanges();
            }

            int currentUserCount = context.Users.Count();
            for (int i = currentUserCount + 1; i <= 12; i++)
            {
                context.Users.Add(new User { Username = $"user{i}", PasswordHash = BCrypt.Net.BCrypt.HashPassword("password") });
            }
            context.SaveChanges();

            string dropView = @"IF OBJECT_ID('View_PersonAccounts', 'V') IS NOT NULL DROP VIEW View_PersonAccounts;";
            context.Database.ExecuteSqlRaw(dropView);

            string createView = @"CREATE VIEW View_PersonAccounts AS SELECT p.PersonId, p.IdNumber, p.FirstName, p.LastName, p.DateOfBirth, a.AccountId, a.AccountNumber, a.OutstandingBalance, a.Status FROM Persons p LEFT JOIN Accounts a ON p.PersonId = a.PersonId;";
            context.Database.ExecuteSqlRaw(createView);
        }
    }
}
