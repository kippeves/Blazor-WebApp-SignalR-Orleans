using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize]
[ApiController]
[Route("api/[controller]/[action]")]
public class ChannelController : ControllerBase
{
    private readonly IChannelRepository channelRepository;

    public ChannelController(IChannelRepository channelRepository)
    {
        this.channelRepository = channelRepository;
    }

    [HttpGet]
    public IActionResult GetChannels()
    {
        return Ok(channelRepository.GetChannels());
    }

    [HttpPost]
    public async Task<IActionResult> Add([FromBody] AddChannelDTO dto) => await channelRepository.AddChannelAsync(dto.Name, dto.Description, dto.Category) ? Ok() : BadRequest();
};

public record AddChannelDTO(string Name, string? Description, string? Category);