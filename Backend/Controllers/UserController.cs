using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Shared.Extensions;
using Grains.Interfaces;
using System.Text.Json;
using Grains.Hubs;
using Microsoft.AspNetCore.SignalR;
using Grains.Interfaces.Abstractions;
using Backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Backend.Controllers;

[Route("backend/[controller]")]
[ApiController]
[Authorize]
public class UserController(ApplicationDbContext context, IClusterClient cluster, IConfiguration config, IHubContext<ChatHub> hubContext, IChannelRepository channelRepository) : ControllerBase
{
    private readonly ApplicationDbContext _context = context;
    private readonly IClusterClient _cluster = cluster;
    private readonly IHubContext<ChatHub> hubContext = hubContext;
    private readonly IChannelRepository channelRepository = channelRepository;

    private IConfiguration Config { get; } = config;
    private Guid UserID => Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var ID) ? ID : default;

    [AllowAnonymous]
    [HttpPost("Control")]
    public IActionResult Control([FromBody] LoginRequest loginRequest)
    {
        try
        {
            var User = _context.Users.Single(u => u.Email != null && u.Email.Equals(loginRequest.email));
            if (Extensions.VerifyPassword(loginRequest.password, User.Password, User.Salt))
            {
                var dto = new UserDTO(id: User.UserId, name: User.UserName, email: User.Email);
                return Ok(dto);
            }
        }
        catch (Exception e)
        {
            Console.Write("Password not verified");
            Console.Write(e.Message);
            return new BadRequestObjectResult(e.Message);
        }
        return BadRequest();
    }

    [HttpGet("Prefetch/Settings")]
    public async Task<IActionResult> PrefetchSettings()
    {
        if (UserID == default)
            return BadRequest();

        var user = _cluster.GetGrain<IChatMemberGrain>(UserID);
        var settings = await user.GetSettings();
        return Ok(settings);
    }

    [HttpGet("Prefetch/Messages")]
    public async Task<IActionResult> PrefetchMessages()
    {
        if (UserID == default)
            return BadRequest();

        var user = _cluster.GetGrain<IChatMemberGrain>(UserID);
        var Channel = await user.GetActiveChannelGrain();
        if (Channel is null) return NoContent();
        var messages = await Channel.ReadHistory(50);
        return Ok(messages);
    }

    [AllowAnonymous]
    [HttpPost("Register")]
    public async Task<IActionResult> RegisterAsync(RegisterRequest obj)
    {
        var hash = Extensions.HashPassword(obj.password, out var salt);
        User newUser = new()
        {
            UserName = obj.name,
            Email = obj.email,
            Password = hash,
            Salt = salt,
        };
        await _context.Users.AddAsync(newUser);
        if (obj.role != null)
        {
            var name = obj.role.ToString();
            var role = _context.Roles.Single(r => r.Name.ToLower().Equals(name));
            newUser.Roles.Add(role);
        }
        await _context.SaveChangesAsync();
        if (newUser.UserName != default)
        {
            var newUserGrain = _cluster.GetGrain<IChatMemberGrain>(newUser.UserId);
            await newUserGrain.SetName(newUser.UserName);
            return Ok();
        }
        else return new BadRequestObjectResult("User couldn't be registered");
    }
    public async Task<IActionResult> ChangeName(NameChangeRequest req)
    {
        var user = _context.Users.Find(req.id);
        if (user is null) return BadRequest(new NameChangeResponse(false, "Could not find user"));

        var sameName = _context.Users.Where(u => u.UserName.ToLower().Equals(req.newName.ToLower())).Any();
        if (sameName) return BadRequest(new NameChangeResponse(false, "User with same name already exists. Please pick another name"));

        user.UserName = req.newName;
        var success = await _context.SaveChangesAsync() > 0;
        if (success)
        {
            var userGrain = _cluster.GetGrain<IChatMemberGrain>(req.id);
            await userGrain.SetName(req.newName);
        }

        return Ok(new NameChangeResponse(true, "Name has been changed"));
    }
};


public enum RegisterRole
{
    user = 0, moderator = 1, administrator = 2
}
public record RegisterRequest(string name, string email, string password, RegisterRole? role) { }
public record LoginRequest(string email, string password);
public record UserDTO(Guid id, string name, string email);
public record NameChangeRequest(Guid id, string newName);
public record NameChangeResponse(bool success, string? message);