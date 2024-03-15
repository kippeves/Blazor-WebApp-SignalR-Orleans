using System.ComponentModel;

namespace Shared.Services
{
    public class InfoService
    {
        private string? Info { get; set; }
        public Task<string?> GetInfo() => Task.FromResult(Info);
        public Task SetInfo(string info)
        {
            Info = info;
            return Task.CompletedTask;
        }
    }
}
