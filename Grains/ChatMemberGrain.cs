using System.Threading.Tasks.Dataflow;
using Grains.Interfaces;
using Grains.Interfaces.Abstractions;
using Orleans.Runtime;

namespace Grains;

public sealed class ChatMemberGrain : Grain, IChatMemberGrain
{
    private readonly IPersistentState<MemberDetails> _state;
    private readonly IPersistentState<AppSettings> _settings;
    private IChannelGrain? ActiveChannel { get; set; }
    public ChatMemberGrain(
        [PersistentState(stateName: "Member")] IPersistentState<MemberDetails> state,
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

    public Task<AppSettings> GetSettings() => Task.FromResult(_settings.State);

    public async Task SetName(string Name)
    {

        _state.State = _state.State with { chatName = Name };
        await _state.WriteStateAsync();
    }

    public Task<string> GetName() => Task.FromResult(_state.State.chatName);

    public Task<MemberDetails> GetDetails() => Task.FromResult(_state.State with { id = this.GetPrimaryKey() });

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