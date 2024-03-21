using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Grains.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Backend.Controllers
{
    [Route("backend/[controller]/[action]")]
    [Authorize]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly IHubContext<ChatHub> _hubContext;
        public MessageController(IHubContext<ChatHub> hubContext)
        {
            _hubContext = hubContext;
        }

        [HttpGet]
        public Task<string> GetUser() => Task.FromResult(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "John Doe");
    }
}
