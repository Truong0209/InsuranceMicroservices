using System;
using Hangfire;
using Hangfire.Logging.LogProviders;
using Hangfire.PostgreSql;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace PaymentService.Jobs;

public static class JobsInstaller
{
    public static IServiceCollection AddBackgroundJobs(
        this IServiceCollection services,
        BackgroundJobsConfig jobsConfig)
    {
        services.AddSingleton(jobsConfig);
        try
        {
            using (var conn = new Npgsql.NpgsqlConnection(jobsConfig.HangfireConnectionStringName))
            {
                conn.Open();
            }
            services.AddHangfire(config =>
            {
                config.UsePostgreSqlStorage(jobsConfig.HangfireConnectionStringName);
                config.UseLogProvider(new ColouredConsoleLogProvider());
            });
            services.AddScoped<InPaymentRegistrationJob, InPaymentRegistrationJob>();
            services.AddHangfireServer();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[Hangfire Notice] PostgreSQL connection failed: {ex.Message}. Hangfire server skipped in standalone mode.");
        }
        return services;
    }

    public static void UseBackgroundJobs(this IApplicationBuilder app)
    {
        try
        {
            app.UseHangfireDashboard();
            RecurringJob.AddOrUpdate<InPaymentRegistrationJob>(j => j.Run(), "*/1 * * * *");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[Hangfire Notice] Background jobs not started: {ex.Message}");
        }
    }
}