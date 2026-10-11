using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using MediatR;

var builder = WebApplication.CreateBuilder(args);

// Đăng ký MediatR cho PolicyService
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(Program).Assembly));

builder.Services.AddControllers();

var app = builder.Build();

app.UseAuthorization();
app.MapControllers();

app.Run();