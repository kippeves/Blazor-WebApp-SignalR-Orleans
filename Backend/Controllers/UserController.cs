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

    [HttpPost("ChangeChannel")]
    public async Task<IActionResult> ChangeChannel([FromBody] ChannelChangeRequest request)
    {
        var userGrain = _cluster.GetGrain<IChatMemberGrain>(UserID);
        await userGrain.SetActiveChannel(request.id);
        return Ok();
    }

    [AllowAnonymous]
    [HttpPost("Token")]
    public IActionResult GenerateToken([FromBody] TokenRequest request)
    {
        if (!Guid.TryParse(request.id, out var id))
            return BadRequest();

        var User = _context.Users.Include(u => u.Roles).Single(u => u.UserId.Equals(id));
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Config["Jwt:Key"]!));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
        var claims = new[] {
            new Claim(JwtRegisteredClaimNames.NameId, User.UserId.ToString()),
            new Claim(JwtRegisteredClaimNames.Sub, User.UserName),
            new Claim(JwtRegisteredClaimNames.Email, User.Email),
            new Claim("Roles",string.Join(",",User.Roles.Select(r => r.Name))),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };

        var Sectoken = new JwtSecurityToken(Config["Jwt:Issuer"],
          Config["Jwt:Audience"],
          claims,
          expires: DateTime.Now.AddMinutes(120),
          signingCredentials: credentials);

        var token = new JwtSecurityTokenHandler().WriteToken(Sectoken);
        return Ok(new TokenResult(token));
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
};

public enum RegisterRole
{
    user = 0, moderator = 1, administrator = 2
}
public record RegisterRequest(string name, string email, string password, RegisterRole? role) { }
public record LoginRequest(string email, string password);
public record UserDTO(Guid id, string name, string email);
public record TokenRequest(string id);
public record TokenResult(string token);
public record ChannelChangeRequest(Guid id);