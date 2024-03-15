using Grains.Hubs;
using Grains.Interfaces;
using Grains.Interfaces.Abstractions;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Protocol;
using Orleans.Concurrency;
using Orleans.Runtime;
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

    public override Task OnActivateAsync(CancellationToken cancellationToken)
    {

        return base.OnActivateAsync(cancellationToken);
    }

    public async Task Join(Guid id)
    {
        _state.State._onlineMembers.Add(id);
        await _state.WriteStateAsync();
    }

    public async Task Leave(Guid id)
    {
        _state.State._onlineMembers.Remove(id);
        await _state.WriteStateAsync();
    }

    public async Task Message(ChatMsg msg)
    {
        _state.State._messages.Add(msg);
        await _state.WriteStateAsync();
        var payload = new InvocationMessage("SendMessage", [msg]);
        await _hubContext.Group(this.GetPrimaryKeyString()).Send(payload);
    }

    public Task<MemberDetails[]> GetMembers()
    {
        List<MemberDetails> _temp = [];
        Parallel.ForEach(_state.State._onlineMembers, async mem =>
        {
            var member = GrainFactory.GetGrain<IChatMemberGrain>(mem);
            _temp.Add(await member.GetDetails());
        });
        return Task.FromResult(_temp.ToArray());
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


}
