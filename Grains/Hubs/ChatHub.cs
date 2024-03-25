using Shared.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Grains.Interfaces;
using System.Text.RegularExpressions;
using System.Globalization;
using static Grains.ChannelGrain;
using Microsoft.AspNetCore.SignalR.Protocol;
using Grains.Interfaces.Abstractions;
using System.Diagnostics;
using Microsoft.Extensions.Configuration;
using System.Data;

namespace Grains.Hubs;
[Authorize]
public class ChatHub(IClusterClient clusterClient) : Hub
{
    private readonly IClusterClient clusterClient = clusterClient;

    IChatMemberGrain GetUser(Guid id) => clusterClient.GetGrain<IChatMemberGrain>(id);

    [HubMethodName("SendMessage")]
    public async Task SendMessage(string message)
    {
        var id = Guid.Parse(Context.User?.FindFirstValue(ClaimTypes.NameIdentifier));
        var user = GetUser(id);
        var channel = await user.GetActiveChannelGrain();
        if (channel is null) return;
        await channel.Message(new ChatMsg(id, "name", message, DateTime.Now));
    }

    [HubMethodName("SwitchChannel")]
    public async Task SwitchChannel(Guid newChannel)
    {
        if (!Guid.TryParse(Context.User?.FindFirstValue(ClaimTypes.NameIdentifier), out var id)) return;
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, id.ToString("N"));
        await GetUser(id).Switch(newChannel);
        await Groups.AddToGroupAsync(Context.ConnectionId, newChannel.ToString("N"));
        await Clients.Client(Context.ConnectionId).SendAsync("JoinedChannel", ChannelState.Joined);
    }


    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await Task.CompletedTask;
        /*        if (!Guid.TryParse(Context.User?.FindFirstValue(ClaimTypes.NameIdentifier), out var id)) return;
                var User = GetUser(id);
                var activeChannel = await User.GetActiveChannel();
                if (activeChannel is null) return;
                try
                {
                    User.Leave(activeChannel);
                    await LeaveChannel(activeChannel.GetPrimaryKey());
                }
                catch (Exception e) { Debug.WriteLine(e.Message); }
                await base.OnDisconnectedAsync(exception);*/
    }

    public async Task JoinChannel(Guid id)
    {
        if (!Guid.TryParse(Context.User?.FindFirstValue(ClaimTypes.NameIdentifier), out var userId)) return;
        await GetUser(userId).Join(id);
        Console.WriteLine(id.ToString("N"));
        await Groups.AddToGroupAsync(Context.ConnectionId, id.ToString("N"));
    }

    public async Task LeaveChannel(Guid id)
    {
        if (!Guid.TryParse(Context.User?.FindFirstValue(ClaimTypes.NameIdentifier), out var userId)) return;
        await GetUser(userId).Leave(id);
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, id.ToString("N"));

    }

    public record JoinChannelDTO(Guid channelId);

}