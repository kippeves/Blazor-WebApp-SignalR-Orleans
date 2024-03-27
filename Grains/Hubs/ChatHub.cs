using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Grains.Interfaces;
using Grains.Interfaces.Abstractions;
using Microsoft.Extensions.Logging;

namespace Grains.Hubs;
[Authorize]
public class ChatHub(IClusterClient clusterClient, ILogger<ChatHub> logger) : Hub
{
    public static readonly Guid InstanceGuid = Guid.NewGuid();
    private readonly IClusterClient _cluster = clusterClient;
    private readonly ILogger<ChatHub> _logger = logger;

    IChatMemberGrain GetUser(Guid id) => _cluster.GetGrain<IChatMemberGrain>(id);
    IChannelGrain GetChannel(Guid id) => _cluster.GetGrain<IChannelGrain>(id);

    [HubMethodName("Message")]
    public async Task Message(SendMessageRequest request)
    {
        if (!Guid.TryParse(Context.User?.FindFirstValue(ClaimTypes.NameIdentifier), out var id)) return;
        var messageRelayGrain = _cluster.GetGrain<IMessageRelayGrain>(InstanceGuid);
        await messageRelayGrain.SendMessage(new(request.id, new(id, request.message)));

        /*        if (!Guid.TryParse(Context.User?.FindFirstValue(ClaimTypes.NameIdentifier), out var id)) return;
                var channel = GetChannel(request.ChannelId);
                await channel.Message(new ChatMsg(request.ChannelId, request.Message));*/
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


    public override async Task OnConnectedAsync()
    {
        if (!Guid.TryParse(Context.User?.FindFirstValue(ClaimTypes.NameIdentifier), out var id)) return;
        var userGrain = GetUser(id);
        var channels = await userGrain.GetSubscribedChannels();
        channels.ToList().ForEach(async c => await Groups.AddToGroupAsync(Context.ConnectionId, c.ToString("N")));
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        if (!Guid.TryParse(Context.User?.FindFirstValue(ClaimTypes.NameIdentifier), out var id)) return;
        _logger.LogInformation("{id} disconnected", id);

        await Task.CompletedTask;
    }

    public async Task JoinChannel(Guid channel)
    {
        if (!Guid.TryParse(Context.User?.FindFirstValue(ClaimTypes.NameIdentifier), out var userId)) return;
        await GetUser(userId).Join(channel);
        await Groups.AddToGroupAsync(Context.ConnectionId, channel.ToString("N"));
    }

    public async Task LeaveChannel(Guid channel)
    {
        if (!Guid.TryParse(Context.User?.FindFirstValue(ClaimTypes.NameIdentifier), out var userId)) return;
        await GetUser(userId).Leave(channel);
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, channel.ToString("N"));

    }

    public record SendMessageRequest(Guid id, string message);
}