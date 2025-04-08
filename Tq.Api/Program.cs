using Tq.Api.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Register EF Core with SQL Server using the connection string from configuration.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add controllers with JSON options to avoid reference cycle issues.
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

// Configure CORS policy to allow Angular front-end during development.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDev", policy =>
        policy.WithOrigins("http://localhost:63528")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// Swagger setup (optional).
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Middleware configuration.
app.UseHttpsRedirection();
app.UseCors("AllowAngularDev");
// app.UseAuthentication(); // Uncomment if using authentication
// app.UseAuthorization();

// Enable Swagger in development mode.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Map controller endpoints.
app.MapControllers();

// Ensure database and seed data (plug-and-play initialization).
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();         // Automatically apply migrations
    SeedData.Initialize(db);      // Seed data and create SPs/views
}

app.Run();
