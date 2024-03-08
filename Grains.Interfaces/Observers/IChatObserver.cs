namespace Grains.Interfaces.Observers
{
    public interface IChatObserver : IGrainObserver
    {
        void ReceiveMessage(string message);

        Task Subscribe();

        Task Unsubscribe();
    }
}
