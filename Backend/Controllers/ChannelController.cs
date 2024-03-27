using Grains.Interfaces;
using Grains.Interfaces.Abstractions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


[ApiController]
[Route("backend/[controller]/[action]")]
public class ChannelController(IChannelRepository channelRepository, IClusterClient cluster, ILogger<ChannelController> logger) : ControllerBase
{
    private readonly IChannelRepository channelRepository = channelRepository;
    private readonly IClusterClient cluster = cluster;
    private readonly ILogger<ChannelController> logger = logger;

    [HttpGet]
    [Authorize]
    public async IAsyncEnumerable<ChannelDTO> GetChannels()
    {
        await foreach (var channel in channelRepository.GetChannels())
        {
            yield return channel;
        }
    }

    [HttpGet]
    [Authorize]
    public async IAsyncEnumerable<ChatMemberDTO> GetMembers()
    {
        var channels = channelRepository.GetListOfChannelIds();
        await foreach (var channel in channels)
        {
            var members = await cluster.GetGrain<IChannelGrain>(channel).GetMembers();
            foreach (var member in members)
            {
                yield return new ChatMemberDTO(member.id, member.chatName, member.pictureURL);
            }
        }
    }

    [HttpPost]
    [Authorize]
    public async IAsyncEnumerable<ChatMsg> GetMessages([FromBody] FetchMessagesDTO dto)
    {
        if (!Guid.TryParse(dto.id, out var id)) yield break;
        var channel = cluster.GetGrain<IChannelGrain>(id);
        var messages = await channel.ReadHistory(dto.amount);
        foreach (var message in messages)
        {
            yield return message;
        }
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Edit([FromBody] NameChangeDTO dto) => await channelRepository.SetNameForChannel(dto.id, dto.newName) ? Ok() : BadRequest();

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Add([FromBody] AddChannelDTO dto) => await channelRepository.AddChannelAsync(dto.Name, dto.Description, dto.Category) ? Ok() : BadRequest();
};

public record FetchMessagesDTO(string id, int amount);
public record AddChannelDTO(string Name, string? Description, string? Category);
public record NameChangeDTO(Guid id, string newName);