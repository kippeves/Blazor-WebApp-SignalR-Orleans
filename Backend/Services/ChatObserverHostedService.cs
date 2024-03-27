using Grains.Interfaces.Observers;

namespace Backend.Services
{
    public class ChatObserverHostedService(IChatObserver chatObserver, ILogger<ChatObserverHostedService> logger) : IHostedService, IDisposable
    {
        private readonly IChatObserver _chatObserver = chatObserver;
        private readonly ILogger<ChatObserverHostedService> _logger = logger;
        private Timer? _timer = null;

        public void Dispose()
        {
            _timer?.Dispose();
            GC.SuppressFinalize(this);
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("ChatObserverHostedService starting.");
            _timer = new Timer(DoWork, null, TimeSpan.Zero, TimeSpan.FromMinutes(3));
            await Task.CompletedTask;
        }

        public async Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("ChatObserverHostedService stopping.");

            _timer?.Change(Timeout.Infinite, 0);

            await _chatObserver.Unsubscribe();
        }

        private async void DoWork(object? state)
        {
            _logger.LogInformation("ChatObserverHostedService triggered.");

            await _chatObserver.Subscribe();
        }
    }
}