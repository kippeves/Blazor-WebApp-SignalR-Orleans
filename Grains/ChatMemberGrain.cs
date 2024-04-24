using Grains.Interfaces;
using Grains.Interfaces.Abstractions;
using Orleans.Runtime;

namespace Grains;

public sealed class ChatMemberGrain : Grain, IChatMemberGrain
{
    private readonly IPersistentState<MemberInfo> _state;
    private readonly IPersistentState<AppSettings> _settings;
    private IChannelGrain? ActiveChannel { get; set; }
    public ChatMemberGrain(
        [PersistentState(stateName: "Member")] IPersistentState<MemberInfo> state,
        [PersistentState(stateName: "AppSettings")] IPersistentState<AppSettings> settings)
    {
        _state = state;
        _settings = settings;
    }

    public override Task OnActivateAsync(CancellationToken cancellationToken)
    {
        if (_settings.State.activeChannel.HasValue)
            ActiveChannel = GrainFactory.GetGrain<IChannelGrain>(_settings.State.activeChannel.Value).AsReference<IChannelGrain>();

        return base.OnActivateAsync(cancellationToken);
    }

    public async Task SetMenu(bool state)
    {
        _settings.State.menuIsOpen = state;
        await _settings.WriteStateAsync();
    }

    public async Task AddSubscribedChannel(Guid id)
    {
        _settings.State.SubscribedChannels.Add(id);
        await _settings.WriteStateAsync();
    }

    public Task<Guid[]> GetSubscribedChannels()
    {
        var initList = _settings.State.SubscribedChannels;
        var active = _settings.State.activeChannel;
        if (active.HasValue) initList.Add(active.Value);
        return Task.FromResult(initList.ToArray());
    }

    public Task<AppSettings> GetSettings() => Task.FromResult(_settings.State);

    public async Task SetName(string Name)
    {

        _state.State = _state.State with { ChatName = Name };
        await _state.WriteStateAsync();
    }

    public Task<string> GetName() => Task.FromResult(_state.State.ChatName);

    public Task<MemberInfo> GetDetails() => Task.FromResult(_state.State with { Id = this.GetPrimaryKey() });

    public async Task SetActiveChannel(Guid? channelId)
    {
        _settings.State.activeChannel = channelId;
        await _settings.WriteStateAsync();

        ActiveChannel = channelId.HasValue ? GrainFactory.GetGrain<IChannelGrain>(channelId.Value) : null;
    }

    public async ValueTask Switch(Guid newId)
    {
        if (ActiveChannel != null)
            await Leave(ActiveChannel.GetPrimaryKey());

        await Join(newId);
    }

    public async ValueTask Join(Guid id)
    {
        using var scope = RequestContext.AllowCallChainReentrancy();
        var roomGrain = GrainFactory.GetGrain<IChannelGrain>(id);
        await roomGrain.Join(this.AsReference<IChatMemberGrain>());
        await SetActiveChannel(id);
    }
    public async ValueTask Leave(Guid id)
    {
        using var scope = RequestContext.AllowCallChainReentrancy();
        var roomGrain = GrainFactory.GetGrain<IChannelGrain>(id);
        await roomGrain.Leave(this.AsReference<IChatMemberGrain>());
        await SetActiveChannel(null);
    }


    public Task<Guid?> GetActiveChannel() => Task.FromResult(_settings.State.activeChannel);
    public Task<IChannelGrain?> GetActiveChannelGrain() => Task.FromResult(ActiveChannel);

}