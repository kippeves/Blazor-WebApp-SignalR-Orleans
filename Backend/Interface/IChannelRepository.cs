using Microsoft.AspNetCore.Mvc;

public interface IChannelRepository
{
    public IAsyncEnumerable<ChannelDTO> GetChannels();
    public IAsyncEnumerable<Guid> GetListOfChannelIds();
    public Task<bool> AddChannelAsync(string name, string category);
    public Task<bool> AddChannelAsync(string name, string? description, string? category);
    public Task<bool> SetNameForChannel(Guid id, string newName);
}

public record ChannelDTO(Guid id, string name);
public record ChatMemberDTO(Guid id, string name, string avatarImg);