using Grains.Interfaces.Abstractions;
using Grains.Interfaces.Observers;

namespace Grains.Interfaces
{
    public interface IChannelGrain : IGrainWithGuidKey
    {
        Task Join(IChatMemberGrain member);
        Task Leave(IChatMemberGrain member);
        Task Message(ChatMsg msg);
        Task<ChatMsg[]> ReadHistory(int numberOfMessages);
        ValueTask<MemberDetails[]> GetMembers();
        Task SetName(string name);
        Task<string> GetName();
        Task<bool> MemberIsInChannel(IChatMemberGrain member);
    }
}