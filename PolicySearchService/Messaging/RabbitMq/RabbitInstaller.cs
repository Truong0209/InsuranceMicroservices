using System;
using System.Collections.Generic;
using EasyNetQ;
using EasyNetQ.Topology;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace PolicySearchService.Messaging.RabbitMq;

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
            services.AddSingleton(svc => new RabbitEventListener(svc.GetRequiredService<IBus>(), svc));
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[RabbitMQ Notice] {ex.Message}. Continuing without active RabbitMQ bus.");
        }

        return services;
    }
}

public static class RabbitListenersInstaller
{
    public static void UseRabbitListeners(this IApplicationBuilder app, List<Type> eventTypes)
    {
        var listener = app.ApplicationServices.GetService<RabbitEventListener>();
        if (listener != null)
        {
            listener.ListenTo(eventTypes);
        }
    }
}
