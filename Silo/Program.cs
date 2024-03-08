using Chat.Server.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Orleans.Providers.Streams.Generator;
using SignalR.Orleans;
namespace Chat.Silo;

public class Program
{
    private static IHost? _host;

    static int Main(string[] args)
    {
        StartHost().Wait();
        Console.ReadLine();

        return 0;
    }

    public static async Task StartHost()
    {
        var builder = Host.CreateDefaultBuilder();

        _host = builder.UseOrleans(siloBuilder =>
            {
                siloBuilder.UseLocalhostClustering();
                siloBuilder.AddMemoryGrainStorageAsDefault();
                siloBuilder.AddMemoryGrainStorage("PubSubStore");
                siloBuilder.RegisterHub<ChatHub>(); // Required for each hub type if the backplane ability #1 is being used.
            })
            .Build();
        builder.ConfigureServices(s =>
        {
            s.AddSignalR().AddOrleans();
        });

        await _host.StartAsync();
    }
    public static async Task StopHost()
    {
        if (_host != null)
        {
            await _host.StopAsync();
        }
    }
}