using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Page.Data;
using Page.Hubs;
using SignalR.Orleans.Core;
using System.Security.Claims;

namespace Page.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize]
    public class MessageController : ControllerBase
    {
        private readonly HubContext<ChatHub> hubContext;
        public MessageController(HubContext<ChatHub> hubContext)
        {
            this.hubContext = hubContext;
        }


        [HttpGet]
        public Task<string> GetUser() => Task.FromResult(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "John Doe");
    }
}
