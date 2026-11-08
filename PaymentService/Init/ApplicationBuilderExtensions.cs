using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace PaymentService.Init;

public static class ApplicationBuilderExtensions
{
    public static async Task UseInitializer(this IApplicationBuilder app)
    {
        try
        {
            using (var scope = app.ApplicationServices.CreateScope())
            {
                var initializer = scope.ServiceProvider.GetService<DataLoader>();
                if (initializer != null)
                {
                    await initializer.Seed();
                }
            }
        }
        catch (System.Exception ex)
        {
            System.Console.WriteLine($"[Payment Init Notice] Data loader skipped: {ex.Message}");
        }
    }
}