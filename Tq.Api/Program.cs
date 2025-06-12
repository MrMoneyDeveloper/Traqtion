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

// Configure very open CORS policy so the demo front end can communicate with
// the API whether it is served from the ASP.NET application or a static file
// during development.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// Swagger setup (optional).
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Middleware configuration.
app.UseHttpsRedirection();
app.UseCors("AllowAll");
// app.UseAuthentication(); // Uncomment if using authentication
// app.UseAuthorization();

// Enable Swagger in development mode.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Serve the compiled front-end from wwwroot
app.UseDefaultFiles();
app.UseStaticFiles();

// Map controller endpoints.
app.MapControllers();

// For unknown routes fall back to the SPA entry point
app.MapFallbackToFile("index.html");

// Ensure database and seed data (plug-and-play initialization).
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();         // Automatically apply migrations
    SeedData.Initialize(db);      // Seed data and create SPs/views
}

app.Run();
