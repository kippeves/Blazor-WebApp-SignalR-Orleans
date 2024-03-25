using Backend.Data;
using Grains.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class ChannelRepository : IChannelRepository
    {
        private readonly ApplicationDbContext context;
        private readonly IClusterClient clusterClient;

        public ChannelRepository(ApplicationDbContext context, IClusterClient clusterClient)
        {
            this.context = context;
            this.clusterClient = clusterClient;
        }

        public async Task<bool> AddChannelAsync(string name, string? category) => await AddChannelAsync(name, category, null);

        public async Task<bool> AddChannelAsync(string name, string? Description, string? category)
        {
            var x = context.Channels;
            if (context.Channels.Any(c => c.Name.ToLower().Equals(name.ToLower()))) return false;

            Category? cat = null;
            if (category != null)
            {
                cat = context.Categories.SingleOrDefault(c => c.Name.ToLower().Equals(category));
                if (cat is null)
                {
                    cat = new Category()
                    {
                        Name = category,
                        Description = string.Empty,
                        Icon = string.Empty
                    };
                    await context.Categories.AddAsync(cat);
                }
            }

            Channel c = new()
            {
                Name = name,
                Description = Description ?? string.Empty,
                Category = cat
            };
            await context.Channels.AddAsync(c);

            return await context.SaveChangesAsync() > 0;
        }

        public IAsyncEnumerable<ChannelDTO> GetChannels() => context.Channels.Select(c => new ChannelDTO(c.Id, c.Name)).AsAsyncEnumerable();

        public IAsyncEnumerable<Guid> GetListOfChannelIds() => context.Channels.Select(c => c.Id).AsAsyncEnumerable();

        public async Task<bool> SetNameForChannel(Guid id, string newName)
        {
            try
            {
                var channel = clusterClient.GetGrain<IChannelGrain>(id);
                await channel.SetName(newName);
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
