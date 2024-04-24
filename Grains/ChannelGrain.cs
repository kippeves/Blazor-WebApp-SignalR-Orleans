using Grains.Hubs;
using Grains.Interfaces;
using Grains.Interfaces.Abstractions;
using Microsoft.AspNetCore.SignalR;
using Orleans.Runtime;

namespace Grains;

public class ChannelGrain : Grain, IChannelGrain
{
    private readonly IHubContext<ChatHub> _hub;
    private readonly IPersistentState<ChannelInfo> _state;


    public ChannelGrain(
        [PersistentState(stateName: "Channel")] IPersistentState<ChannelInfo> state,
        IHubContext<ChatHub> hub
        )
    {
        _state = state;
        _hub = hub;
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

    public async Task Message(MemberInfo User, string Message)
    {

        var message = new Message(User, Message);
        _state.State._messages.Add(message);
        await _state.WriteStateAsync();
        await _hub.Clients.All.SendAsync("ReceiveMessage", new MessageResponse(this.GetPrimaryKey(), message));
    }

    public async ValueTask<MemberInfo[]> GetMembers()
    {
        return await Task.WhenAll(Members.Select(m => m.GetDetails()));
    }

    public Task<Message[]> ReadHistory(Guid? fromId)
    {
        var result = _state.State._messages.OrderByDescending(m => m.created).ToList();
        if (fromId != null)
        {
            var list = _state.State._messages;
            var index = list.IndexOf(list.Single(m => m.id.Equals(fromId)));
            result = result.Skip(index).ToList();
        }
        return Task.FromResult(result.Take(50).ToArray());
    }


    public record JoinChannelEvent(Guid ChannelId, string ChannelName);

}
