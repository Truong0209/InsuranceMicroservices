using System;
using EasyNetQ;
using EasyNetQ.Topology;
using Microsoft.Extensions.DependencyInjection;
using PolicyService.Messaging.RabbitMq.Outbox;

namespace PolicyService.Messaging.RabbitMq;

public static class RabbitInstaller
{
    public static IServiceCollection AddRabbitListeners(this IServiceCollection services)
    {
        var host = Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER") == "true" ? "rabbit" : "localhost";
        var connectionStr = $"host={host}:5672;username=guest;password=guest";
        try
        {
            var bus = RabbitHutch.CreateBus(connectionStr);
            bus.Advanced.ExchangeDeclare("lab-dotnet-micro", ExchangeType.Topic);
            services.AddSingleton(bus);
            services.AddScoped<IEventPublisher, OutboxEventPublisher>();
            services.AddSingleton<Outbox.Outbox>();
            services.AddHostedService<OutboxSendingService>();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[RabbitMQ Notice] {ex.Message}. Continuing without active RabbitMQ bus.");
        }
        return services;
    }
}
