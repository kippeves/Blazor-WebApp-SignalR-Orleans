using Grains.Interfaces.Observers;
using Grains.Interfaces;
using Grains.Hubs;
using Microsoft.AspNetCore.SignalR;
using System.Linq.Expressions;
using Orleans;

namespace BlazorSignalrOrleans.Server.Observers
{
    public class ChatObserver(IHubContext<ChatHub> hubContext, IGrainFactory grainFactory, ILogger<ChatObserver> logger) : IChatObserver
    {
        private readonly IHubContext<ChatHub> _hubContext = hubContext;
        private readonly IGrainFactory _grainFactory = grainFactory;
        private readonly ILogger<ChatObserver> _logger = logger;
        private IChatObserver? _obj;

        public async void ReceiveMessage(MessageRequest req)
        {
            _logger.LogInformation(req.ToString());
            await _hubContext.Clients.All.SendAsync("ReceiveMessage", req);
        }

        public async Task Subscribe()
        {
            _logger.LogInformation("ChatObserver subscribing to grain.");

            var messageRelayGrain = _grainFactory.GetGrain<IMessageRelayGrain>(ChatHub.InstanceGuid);
            _obj ??= _grainFactory.CreateObjectReference<IChatObserver>(this);
            await Task.Delay(100);
            await messageRelayGrain.Subscribe(_obj);
        }

        public async Task Unsubscribe()
        {
            if (_obj != null)
            {
                _logger.LogInformation("ChatObserver unsubscribing from grain.");
                var messageRelayGrain = _grainFactory.GetGrain<IMessageRelayGrain>(ChatHub.InstanceGuid);
                await messageRelayGrain.Unsubscribe(_obj);
            }
        }
    }

}