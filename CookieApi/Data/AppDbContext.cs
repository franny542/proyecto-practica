using Microsoft.EntityFrameworkCore;
using CookieApi.Models;

namespace CookieApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(
            DbContextOptions<AppDbContext> options
        ) : base(options)
        {

        }

        public DbSet<Policy> Policies { get; set; }
    }
}