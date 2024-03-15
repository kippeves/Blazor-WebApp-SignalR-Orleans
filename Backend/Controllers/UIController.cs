using System.Security.Claims;
using Grains.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UIController : ControllerBase
{
    private readonly IClusterClient clusterClient;

    public UIController(IClusterClient clusterClient)
    {
        this.clusterClient = clusterClient;
    }

    [HttpPost("Menu")]
    public async Task<IActionResult> SetMenuState(MenuStateDTO menuState)
    {
        var idString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (Guid.TryParse(idString, out var value))
        {
            var user = clusterClient.GetGrain<IChatMemberGrain>(value);
            await user.SetMenu(menuState.IsOpen);
            return Ok();
        }
        else return BadRequest();
    }
}

public record MenuStateDTO(bool IsOpen);