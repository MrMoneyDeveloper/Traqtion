using Tq.Api.Data;
using Microsoft.EntityFrameworkCore; // This gives us UseSqlServer & Migrate


var builder = WebApplication.CreateBuilder(args);

// Add EF Core
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    ));

// Add controllers, minimal for Phase 1
builder.Services.AddControllers();

var app = builder.Build();
app.MapControllers();

// Migrate & seed on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();

    // Optional: call a seeding method
    SeedData.Initialize(db);
}

app.Run();
