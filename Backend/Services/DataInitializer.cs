namespace Backend.Services
{
    public class DataInitializer
    {
        private readonly ApplicationDbContext _context;

        public DataInitializer(ApplicationDbContext context)
        {
            _context = context;
        }

        public Task SeedRoles()
        {
            var r = _context.Roles.SingleOrDefault(r => r.Name.Equals("User"));
            if (r != default) return Task.CompletedTask;

            _context.Roles.Add(new() { Name = "User" });
            _context.Roles.Add(new() { Name = "Moderator" });
            _context.Roles.Add(new() { Name = "Administrator" });
            _context.SaveChanges();
            return Task.CompletedTask;
        }
    }
}