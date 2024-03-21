using Grains.Hubs;
using Grains.Interfaces;
using Grains.Interfaces.Abstractions;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Protocol;
using Orleans;
using Orleans.Concurrency;
using Orleans.Runtime;
using OrleansCodeGen.Orleans;
using SignalR.Orleans.Core;

namespace Grains;
[Reentrant]
public class ChannelGrain : Grain, IChannelGrain
{
    private readonly HubContext<ChatHub> _hubContext;
    private readonly IPersistentState<ChannelDetails> _state;

    public ChannelGrain(
        [PersistentState(
        stateName: "Channel")]
        IPersistentState<ChannelDetails> state
        )
    {
        _state = state;
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

    public Task Join(IChatMemberGrain member)
    {
        Members.Add(member);
        return Task.CompletedTask;
    }

    public Task Leave(IChatMemberGrain member)
    {
        Members.Remove(member);
        return Task.CompletedTask;
    }

    public async Task Message(ChatMsg msg)
    {
        Console.WriteLine("sendering message now");
        _state.State._messages.Add(msg);
        await _state.WriteStateAsync();
        var payload = new InvocationMessage("ReceiveMessage", [msg]);
        Console.WriteLine(msg.ToString());
        var keyStr = this.GetPrimaryKeyString();
        await _hubContext.Group(keyStr).Send(payload);
    }

    public async ValueTask<MemberDetails[]> GetMembers()
    {
        return await Task.WhenAll(Members.Select(m => m.GetDetails()));
    }

    public Task<ChatMsg[]> ReadHistory(int numberOfMessages)
    {
        var response = _state.State._messages
            .OrderByDescending(x => x.Created)
            .Take(numberOfMessages)
            .OrderBy(x => x.Created)
            .ToArray();

        return Task.FromResult(response);
    }


    public record JoinChannelEvent(Guid channelId, string channelName);
}
