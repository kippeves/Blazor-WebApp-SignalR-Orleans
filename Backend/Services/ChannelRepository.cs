using System.Runtime.CompilerServices;
using Backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.SqlServer.Query.Internal;

namespace Backend.Services
{
    public class ChannelRepository : IChannelRepository
    {
        private readonly ApplicationDbContext context;

        public ChannelRepository(ApplicationDbContext context)
        {
            this.context = context;
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

        public IEnumerable<ChannelDTO> GetChannels() => context.Channels.Select(c => new ChannelDTO(c.Id, c.Name));
    }
}
