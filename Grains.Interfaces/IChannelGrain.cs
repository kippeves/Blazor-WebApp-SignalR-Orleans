using Grains.Interfaces.Abstractions;

namespace Grains.Interfaces
{
    public interface IChannelGrain : IGrainWithGuidKey
    {
        Task Join(IChatMemberGrain member);
        Task Leave(IChatMemberGrain member);
        Task Message(MemberInfo User, string Text);
        Task<Message[]> ReadHistory(Guid? fromId);
        ValueTask<MemberInfo[]> GetMembers();
        Task SetName(string name);
        Task<string> GetName();
        Task<bool> MemberIsInChannel(IChatMemberGrain member);
    }
}