using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Role> Roles { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Channel> Channels { get; set; }
        public DbSet<Category> Categories { get; set; }
    }

    public class Role
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = default!;
        public List<User> Users { get; } = [];
    }

    [PrimaryKey(nameof(UserId))]
    public class User
    {
        public Guid UserId { get; set; }
        public string UserName { get; set; } = default!;
        public string Password { get; set; } = default!;
        public byte[] Salt { get; set; } = default!;
        public string Email { get; set; } = default!;
        public List<Role> Roles { get; } = [];
        public string? PictureURL { get; set; }
    }

    public class Channel
    {
        public Guid Id { get; set; }
        public Category? Category { get; set; }
        public string Name { get; set; } = default!;
        public string Description { get; set; } = default!;
    }

    public class Category
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = default!;
        public string Description { get; set; } = default!;
        public string Icon { get; set; } = default!;
        public List<Channel> Channels { get; set; } = [];
    }
}