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
                yield return new ChatMemberDTO(member.Id, member.ChatName, member.PictureURL);
            }
        }
    }

    [HttpGet]
    [Authorize]
    public async IAsyncEnumerable<Message> GetMessages(Guid id, Guid? post)
    {
        var channel = cluster.GetGrain<IChannelGrain>(id);
        var messages = await channel.ReadHistory(post);
        foreach (var message in messages.OrderBy(m => m.created))
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

public record FetchMessagesDTO(Guid channelId, Guid? postId);
public record AddChannelDTO(string Name, string? Description, string? Category);
public record NameChangeDTO(Guid id, string newName);