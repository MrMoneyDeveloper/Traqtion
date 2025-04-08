using Tq.Api.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Register EF Core with SQL Server using the connection string from configuration.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add controllers with JSON options to ignore cycles in object graphs.
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

// Configure CORS policy for Angular development.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDev", policy =>
        policy.WithOrigins("http://localhost:63528")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// Optional: Enable Swagger for API documentation.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Use HTTPS redirection.
app.UseHttpsRedirection();

// Use the CORS policy.
app.UseCors("AllowAngularDev");

// Uncomment and configure the following if you add authentication/authorization.
// app.UseAuthentication();
// app.UseAuthorization();

// Enable Swagger only in Development environment.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Map controller endpoints.
app.MapControllers();

// Automatically apply pending migrations and seed the database.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
    SeedData.Initialize(db);
}

app.Run();
