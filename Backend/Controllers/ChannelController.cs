using Grains.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize]
[ApiController]
[Route("backend/[controller]/[action]")]
public class ChannelController(IChannelRepository channelRepository, IClusterClient cluster) : ControllerBase
{
    private readonly IChannelRepository channelRepository = channelRepository;
    private readonly IClusterClient cluster = cluster;

    [HttpGet]
    public IActionResult GetChannels()
    {
        var x = channelRepository.GetChannels();
        return Ok(channelRepository.GetChannels());
    }

    [HttpGet]
    public async Task<IActionResult> GetMembers(Guid id)
    {
        var channel = cluster.GetGrain<IChannelGrain>(id);
        var members = await channel.GetMembers();
        return members is not null ? Ok(members) : BadRequest();

    }

    [HttpPost]
    public async Task<IActionResult> GetMessages([FromBody] FetchMessagesDTO dto)
    {
        if (!Guid.TryParse(dto.id, out var id)) return BadRequest();
        var channel = cluster.GetGrain<IChannelGrain>(id);
        var messages = await channel.ReadHistory(dto.amount);
        return messages != null ? Ok(messages) : BadRequest();
    }

    [HttpPost]
    public async Task<IActionResult> Edit([FromBody] NameChangeDTO dto) => await channelRepository.SetNameForChannel(dto.id, dto.newName) ? Ok() : BadRequest();

    [HttpPost]
    public async Task<IActionResult> Add([FromBody] AddChannelDTO dto) => await channelRepository.AddChannelAsync(dto.Name, dto.Description, dto.Category) ? Ok() : BadRequest();
};

public record FetchMessagesDTO(string id, int amount);
public record AddChannelDTO(string Name, string? Description, string? Category);
public record NameChangeDTO(Guid id, string newName);