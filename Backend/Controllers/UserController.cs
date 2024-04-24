using System.Security.Claims;

namespace Backend.Controllers;

[Route("backend/[controller]")]
[ApiController]
public class UserController(ApplicationDbContext context, IClusterClient cluster, IConfiguration config) : ControllerBase
{
    static string ErrorMessage = "The {0} is already registered to a existing account. Please pick another {0}.";
    private static string CreateErrormessage(string category) => string.Format(ErrorMessage, category);
    private readonly ApplicationDbContext _context = context;
    private readonly IClusterClient _cluster = cluster;

    private IConfiguration Config { get; } = config;
    private Guid UserID => Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var ID) ? ID : default;

    [HttpPost("Control")]
    [ApiKey]
    public IActionResult Control([FromBody] LoginRequest loginRequest)
    {
        try
        {
            var User = _context.Users.Single(u => u.Email != null && u.Email.Equals(loginRequest.email));
            if (Extensions.VerifyPassword(loginRequest.password, User.Password, User.Salt))
            {
                return Ok(new UserDTO(id: User.UserId, name: User.UserName, email: User.Email));
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

    [HttpGet("control/email")]
    [ApiKey]
    public async Task<IActionResult> ControlEmail(string value)
    {
        try
        {
            await _context.Users.SingleAsync(u => u.Email.Equals(value));
            return Ok(false);
        }
        catch { return Ok(true); }
    }

    [ApiKey]
    [HttpGet("control/username")]
    public async Task<IActionResult> ControlUsername(string value)
    {
        if (string.IsNullOrEmpty(value)) return BadRequest(new RegisterControlResponse(false, "No username was submitted"));
        return await _context.Users.AnyAsync(u => u.UserName.Equals(value))
            ? new BadRequestObjectResult(new RegisterControlResponse(false, CreateErrormessage("username")))
            : Ok(new RegisterControlResponse(true, null));
    }

    [Authorize]
    [HttpGet("Prefetch/Settings")]
    public async Task<IActionResult> PrefetchSettings()
    {
        if (UserID == default)
            return BadRequest();

        var user = _cluster.GetGrain<IChatMemberGrain>(UserID);
        var settings = await user.GetSettings();
        return Ok(settings);
    }

    [ApiKey]
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

    [Authorize]
    [HttpPost("ChangeName")]
    public async Task<IActionResult> ChangeName([FromBody] NameChangeRequest req)
    {
        var user = _context.Users.Find(UserID);
        if (user is null) return BadRequest(new NameChangeResponse(false, "Could not find user"));

        var sameName = _context.Users.Where(u => u.UserName.ToLower().Equals(req.NewName.ToLower())).Any();
        if (sameName) return BadRequest(new NameChangeResponse(false, "User with same name already exists. Please pick another name"));

        user.UserName = req.NewName;
        _context.Update(user);
        var changes = await _context.SaveChangesAsync();
        if (changes > 0)
        {
            var userGrain = _cluster.GetGrain<IChatMemberGrain>(UserID);
            await userGrain.SetName(req.NewName);
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
public record NameChangeRequest(string NewName);
public record NameChangeResponse(bool success, string? message);
public record RegisterControlRequest(string value);
public record RegisterControlResponse(bool isSuccess, string? message);