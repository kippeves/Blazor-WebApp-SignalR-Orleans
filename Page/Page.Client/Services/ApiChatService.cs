using Page.Shared.Interfaces;

namespace Page.Client.Services
{
    public class ApiChatService : IChatService
    {
        private static readonly string[] result = ["Some", "Other", "Values"];
        public Task<string[]> GetValueAsync() => Task.FromResult(result);
    }
}
