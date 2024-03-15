using Shared.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Grains.Interfaces;

namespace Grains.Hubs;
[Authorize]
public class ChatHub : Hub
{
    private readonly IClusterClient clusterClient;
    public ChatHub(IClusterClient clusterClient)
    {
        this.clusterClient = clusterClient;
    }

    public async Task SendMessage(string message)
    {
        if (Guid.TryParse(Context.User?.FindFirstValue(ClaimTypes.NameIdentifier), out var Value))
        {

        }
    }

    public override Task OnConnectedAsync()
    {
        var UserName = Context?.User?.FindFirstValue(ClaimTypes.Name);
        Console.WriteLine($"{UserName} has joined");
        return Task.CompletedTask;
    }

    public async Task AddToGroup(string groupName)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
    }

    public async Task RemoveFromGroup(string groupName)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
    }
}