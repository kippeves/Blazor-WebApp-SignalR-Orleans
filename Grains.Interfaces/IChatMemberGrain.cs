using Grains.Interfaces.Abstractions;

namespace Grains.Interfaces
{
    public interface IChatMemberGrain : IGrainWithGuidKey
    {
        Task SetName(string chatName);
        Task<string> GetName();

        Task<MemberInfo> GetDetails();
        Task<AppSettings> GetSettings();
        Task SetActiveChannel(Guid? channelId);
        Task<Guid?> GetActiveChannel();
        Task SetMenu(bool isOpen);
        ValueTask Switch(Guid newId);
        ValueTask Leave(Guid id);
        ValueTask Join(Guid id);
        Task<IChannelGrain?> GetActiveChannelGrain();
        Task<Guid[]> GetSubscribedChannels();
        Task AddSubscribedChannel(Guid id);
    }
}