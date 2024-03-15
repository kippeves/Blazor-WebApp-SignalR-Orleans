using Microsoft.EntityFrameworkCore;
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {

    }

    public DbSet<User> Users { get; set; }
    public DbSet<Channel> Channels { get; set; }
    public DbSet<Category> Categories { get; set; }
}

[PrimaryKey(nameof(UserId))]
public class User
{
    public Guid UserId { get; set; }
    public string UserName { get; set; } = default!;
    public string Password { get; set; } = default!;
    public byte[] Salt { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string? PictureURL { get; set; }
}

public class Channel
{
    public Guid Id { get; set; }
    public Guid? CategoryId { get; set; }
    public Category? Category { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
}

public class Category
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string Icon { get; set; }
    public List<Channel> Channels { get; set; }
}