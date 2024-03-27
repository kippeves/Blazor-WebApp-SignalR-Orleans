using Grains.Hubs;
using Grains.Interfaces;
using Grains.Interfaces.Abstractions;
using Microsoft.Extensions.Logging;
using Orleans.Concurrency;
using Orleans.Runtime;
using SignalR.Orleans.Core;

namespace Grains;
[Reentrant]
public class ChannelGrain : Grain, IChannelGrain
{
    private string GrainId => this.GetPrimaryKeyString();
    private readonly HubContext<ChatHub> _hubContext;
    private readonly IPersistentState<ChannelDetails> _state;
    private readonly ILogger<IChannelGrain> _logger;

    public ChannelGrain(
        [PersistentState(stateName: "Channel")] IPersistentState<ChannelDetails> state,
        ILogger<IChannelGrain> logger
        )
    {
        _state = state;
        _logger = logger;
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
        var keyId = member.GetPrimaryKey().ToString();
        var name = await member.GetName();
        _logger.LogInformation("[{keyId}]: {name} joined", keyId, name);
        await Task.CompletedTask;
    }

    public async Task Leave(IChatMemberGrain member)
    {
        Members.Remove(member);
        var keyId = member.GetPrimaryKey().ToString();
        var name = await member.GetName();
        _logger.LogInformation("[{keyId}]: {name} left", keyId, name);
        await Task.CompletedTask;
    }

    public async Task Message(ChatMsg msg)
    {
        _state.State._messages.Add(msg);
        await _state.WriteStateAsync();
        await _hubContext.Group(GrainId).Send(new("ReceiveMessage", [msg]));
    }

    public async ValueTask<MemberDetails[]> GetMembers()
    {
        return await Task.WhenAll(Members.Select(m => m.GetDetails()));
    }

    public Task<ChatMsg[]> ReadHistory(int numberOfMessages)
    {
        var response = _state.State._messages
            .OrderByDescending(x => x.Created)
            .Take(numberOfMessages).ToArray();

        return Task.FromResult(response);
    }


    public record JoinChannelEvent(Guid channelId, string channelName);
}
