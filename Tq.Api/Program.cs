using Tq.Api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Register EF Core with SQL Server using the connection string from configuration.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add controllers (minimal setup for Phase 1)
builder.Services.AddControllers();

// Configure CORS policy for Angular development.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDev", policy =>
        policy.WithOrigins("http://localhost:63528")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();

// Use the CORS policy.
app.UseCors("AllowAngularDev");

// Map controller endpoints.
app.MapControllers();

// Apply pending migrations and seed the database.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
    SeedData.Initialize(db);
}

app.Run();
