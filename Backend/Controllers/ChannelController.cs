using System.Text.Json;
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
    public async Task<IActionResult> GetMembers()
    {
        var channels = channelRepository.GetListOfChannelIds();
        List<ChatMemberDTO> exportMembers = [];
        foreach (var channel in channels)
        {
            var members = await cluster.GetGrain<IChannelGrain>(channel).GetMembers();
            exportMembers.AddRange(members.Select(m => new ChatMemberDTO(m.id, m.chatName, m.pictureURL)));
        }
        var listJson = JsonSerializer.Serialize(exportMembers);
        Console.WriteLine(listJson);
        return Ok(exportMembers);
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