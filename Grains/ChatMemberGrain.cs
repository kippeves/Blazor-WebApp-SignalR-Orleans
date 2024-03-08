using Grains.Interfaces;
using Grains.Interfaces.Abstractions;
using Orleans.Concurrency;
using Orleans.Runtime;

namespace Grains
{
    public sealed class ChatMemberGrain : Grain, IChatMemberGrain
    {
        private readonly IPersistentState<MemberDetails> _state;

        public ChatMemberGrain(
            [PersistentState(
        stateName: "Member")]
        IPersistentState<MemberDetails> state)
        {
            _state = state;
        }

        public async Task SetName(string Name)
        {

            _state.State = _state.State with { ChatName = Name };

            await _state.WriteStateAsync();
        }

        public Task<string> GetName() =>
            Task.FromResult(_state.State.ChatName);

        public Task<MemberDetails> GetDetails() => Task.FromResult(_state.State);
    }
}