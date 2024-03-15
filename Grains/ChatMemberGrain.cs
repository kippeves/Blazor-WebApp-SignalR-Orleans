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

    public async Task SetMenu(bool state)
    {
        _settings.State.MenuIsOpen = state;
        await _settings.WriteStateAsync();
    }

    public Task<AppSettings> GetSettings() => Task.FromResult(_settings.State);

    public async Task SetName(string Name)
    {

        _state.State = _state.State with { ChatName = Name };
        await _state.WriteStateAsync();
    }

    public Task<string> GetName() =>
        Task.FromResult(_state.State.ChatName);

    public Task<MemberDetails> GetDetails() => Task.FromResult(_state.State);

    public async Task ChangeChannel(Guid channelId)
    {
        if (channelId == _settings.State.ActiveChannel) return;

        if (_settings.State.ActiveChannel != null)
        {
            if ((IChannelGrain?)GrainFactory.GetGrain<IChannelGrain>(_settings.State.ActiveChannel.Value) != null)
                await GrainFactory.GetGrain<IChannelGrain>(_settings.State.ActiveChannel.Value).Leave(this.GetPrimaryKey());
        }


        _settings.State.ActiveChannel = channelId;
        await _settings.WriteStateAsync();
        await GrainFactory.GetGrain<IChannelGrain>(_settings.State.ActiveChannel.Value).Join(_settings.State.ActiveChannel.Value);
    }

    public Task<Guid?> GetActiveChannel() => Task.FromResult(_settings.State.ActiveChannel);
}