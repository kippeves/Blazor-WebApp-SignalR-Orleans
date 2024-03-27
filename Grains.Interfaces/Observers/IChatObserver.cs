namespace Grains.Interfaces.Observers
{
    public interface IChatObserver : IGrainObserver
    {
        void ReceiveMessage(MessageRequest req);

        Task Subscribe();

        Task Unsubscribe();
    }
}
