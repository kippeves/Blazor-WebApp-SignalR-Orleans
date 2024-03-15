using Grains.Interfaces.Abstractions;

namespace Grains.Interfaces
{
    public interface IChannelGrain : IGrainWithGuidKey
    {
        Task Join(Guid id);
        Task Leave(Guid id);
        Task Message(ChatMsg msg);
        Task<ChatMsg[]> ReadHistory(int numberOfMessages);
        Task<MemberDetails[]> GetMembers();

    }
}