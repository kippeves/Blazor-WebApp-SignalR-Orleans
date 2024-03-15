using Grains.Interfaces.Abstractions;

namespace Grains.Interfaces
{
    public interface IChatMemberGrain : IGrainWithGuidKey
    {
        Task SetName(string chatName);
        Task<string> GetName();

        Task<MemberDetails> GetDetails();
        Task<AppSettings> GetSettings();
        Task ChangeChannel(Guid channelId);
        Task<Guid?> GetActiveChannel();
        Task SetMenu(bool isOpen);
    }
}