using Grains.Interfaces.Observers;

namespace Grains.Interfaces
{
    public interface IMessageRelayGrain : IGrainWithGuidKey
    {
        Task SendMessage(string user, string message);

        public Task Unsubscribe(IChatObserver observer);

        public Task Subscribe(IChatObserver observer);
    }
}
