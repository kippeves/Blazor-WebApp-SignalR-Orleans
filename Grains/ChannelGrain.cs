using Grains.Hubs;
using Grains.Interfaces;
using Grains.Interfaces.Abstractions;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Orleans.Concurrency;
using Orleans.Runtime;
using SignalR.Orleans.Core;

namespace Grains;

public class ChannelGrain : Grain, IChannelGrain
{
    private string GrainId => this.GetPrimaryKeyString();
    private readonly HubContext<ChatHub> _hubContext;
    private readonly IHubContext<ChatHub> _hub;
    private readonly IPersistentState<ChannelDetails> _state;
    private readonly ILogger<IChannelGrain> _logger;

    public ChannelGrain(
        [PersistentState(stateName: "Channel")] IPersistentState<ChannelDetails> state,
        ILogger<IChannelGrain> logger,
        IHubContext<ChatHub> hub
        )
    {
        _state = state;
        _logger = logger;
        _hub = hub;
        _hubContext = GrainFactory.GetHub<ChatHub>();
    }

    public HashSet<IChatMemberGrain> Members { get; set; } = [];

    public Task<string> GetName() => Task.FromResult(_state.State.Name);


    public async Task SetName(string name)
    {
        _state.State.Name = name;
        await _state.WriteStateAsync();
    }
    public Task<bool> MemberIsInChannel(IChatMemberGrain member) => Task.FromResult(Members.Contains(member));

    public async Task Join(IChatMemberGrain member)
    {
        Members.Add(member);
        await Task.CompletedTask;
    }

    public async Task Leave(IChatMemberGrain member)
    {
        Members.Remove(member);
        await Task.CompletedTask;
    }

    public async Task Message(ChatMsg msg)
    {

        _state.State._messages.Add(msg);
        await _state.WriteStateAsync();
        var sentMessage = new MessageResponse(this.GetPrimaryKey(), msg);
        await _hub.Clients.All.SendAsync("ReceiveMessage", sentMessage);
    }

    public async ValueTask<MemberDetails[]> GetMembers()
    {
        return await Task.WhenAll(Members.Select(m => m.GetDetails()));
    }

    public Task<ChatMsg[]> ReadHistory(Guid? fromId)
    {
        var result = _state.State._messages.OrderByDescending(m => m.Created).ToList();
        if (fromId != null)
        {
            var list = _state.State._messages;
            var index = list.IndexOf(list.Single(m => m.Id.Equals(fromId)));
            result = result.Skip(index).ToList();
        }
        return Task.FromResult(result.Take(50).ToArray());
    }


    public record JoinChannelEvent(Guid ChannelId, string ChannelName);

}
