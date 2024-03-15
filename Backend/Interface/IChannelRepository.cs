public interface IChannelRepository
{
    public IEnumerable<ChannelDTO> GetChannels();
    public Task<bool> AddChannelAsync(string name, string category);
    public Task<bool> AddChannelAsync(string name, string? description, string? category);
}

public record ChannelDTO(Guid id, string Name);