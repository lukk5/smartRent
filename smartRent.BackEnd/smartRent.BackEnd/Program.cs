using System;
using System.Text;
using AutoMapper;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using smartRent.BackEnd.Utils;
using smartRent.Repo.Context;
using smartRent.Repo.Repo;
using smartRent.Repo.RepoInterfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using smartRent.BackEnd.Domain.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
var config = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build() ??
             throw new ArgumentNullException($"new ConfigurationBuilder().AddJsonFile(\"appsettings.json\").Build()");
builder.Services.AddDbContext<SmartRentDbContext>(options =>
    options.UseSqlServer(config.GetConnectionString("DefaultConnection")));
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: config.GetValue<string>("CORS:CorsName"),
        corsPolicyBuilder =>
        {
            corsPolicyBuilder.WithOrigins(config.GetValue<string>("CORS:CorsAddressLocal"))
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowAnyOrigin();
            //builder.WithOrigins(Configuration.GetSection("CorsAddressCloud").Value.ToString());
        });
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(config.GetValue<string>("JWTSecretKey"))
            )
        };
    });

builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IFileRepository, FileRepository>();
var mapperConfig = new MapperConfiguration(mc => { mc.AddProfile(new MappingProfile()); });
builder.Services.AddSingleton<IAuthService>(
    new AuthService(
        config.GetValue<string>("JWTSecretKey"),
        config.GetValue<int>("JWTLifespan")
    )
);

builder.Services.AddAuthorization(auth =>
{
    auth.AddPolicy("Bearer", new AuthorizationPolicyBuilder(JwtBearerDefaults.AuthenticationScheme)
        .RequireAuthenticatedUser()
        .Build());
});

builder.Services.AddSingleton(mapperConfig.CreateMapper());
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(config.GetValue<string>("CORS:CorsName"));
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();