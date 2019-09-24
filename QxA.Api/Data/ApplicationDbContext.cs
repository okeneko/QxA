using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using QxA.Api.Models;

namespace QxA.Infrastructure.Data
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<QuestionAnswer> Questions { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<QuestionAnswer>()
                .HasOne(q => q.Owner);

            builder.Entity<QuestionAnswer>()
                .HasOne(q => q.Asker);

            builder.Entity<QuestionAnswer>()
                .Property(q => q.Asked)
                .HasDefaultValueSql("getdate()");
        }
    }
}
