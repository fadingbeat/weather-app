using Microsoft.EntityFrameworkCore;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    // tables go here later, e.g:
    // public DbSet<User> Users => Set<User>();
}