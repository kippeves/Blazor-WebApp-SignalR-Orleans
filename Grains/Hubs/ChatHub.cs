using Page.Shared.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Grains.Interfaces;

namespace Page.Hubs;
[Authorize]
public class ChatHub : Hub, IChatHub
{
    private readonly IClusterClient clusterClient;

    public ChatHub(IClusterClient clusterClient)
    {
        this.clusterClient = clusterClient;
    }

    public async Task SendMessage(string message)
    {
        if(Guid.TryParse(Context.User?.FindFirstValue(ClaimTypes.NameIdentifier), out var Value))
        {

        }
            //clusterClient.GetGrain<IChannelGrain>("test").Message()
    }
    public override Task OnConnectedAsync()
    {
        var x = Context.User;
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

public interface IChatHub
{
    public Task AddToGroup(string groupName);
    public Task RemoveFromGroup(string groupName);
}