using Microsoft.AspNetCore.Authorization;
using Page.Shared.Interfaces;

namespace Page.Services
{
    public class ChatService : IChatService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        public ChatService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        private static readonly string[] result = ["Hej", "Test", "Okej då"];


        public Task<string[]> GetValueAsync() => Task.FromResult(result);
    }
}
