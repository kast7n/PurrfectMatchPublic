using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using PurrfectMatch.Domain.Entities;

namespace PurrfectMatch.Infrastructure.Data
{
    public class ApplicationIdentityDbContext(DbContextOptions<ApplicationIdentityDbContext> options) : IdentityDbContext<User>(options)
    {
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);            builder.Entity<IdentityRole>().HasData(new IdentityRole
            {
                Id = "378d3909-357b-47f0-a12e-16bc6e474001",
                Name = "Member",
                NormalizedName = "MEMBER"
            }
            , new IdentityRole
            {
                Id = "5b836deb-3a05-44c4-a6e5-8bd7244cafa1",
                Name = "Admin",
                NormalizedName = "ADMIN"
            }
            , new IdentityRole
            {
                Id = "8b237dec-2a04-44c5-a7f6-9bd8355eaba2",
                Name = "ShelterManager",
                NormalizedName = "SHELTERMANAGER"
            });

            // Ignore unnecessary tables from PurrfectMatchContext
            builder.Ignore<PurrfectMatch.Domain.Entities.ActivityLevel>();
            builder.Ignore<PurrfectMatch.Domain.Entities.Address>();
            builder.Ignore<PurrfectMatch.Domain.Entities.AdoptionApplication>();
            builder.Ignore<PurrfectMatch.Domain.Entities.ApplicationNotification>();
            builder.Ignore<PurrfectMatch.Domain.Entities.Breed>();
            builder.Ignore<PurrfectMatch.Domain.Entities.CoatLength>();
            builder.Ignore<PurrfectMatch.Domain.Entities.Color>();
            builder.Ignore<PurrfectMatch.Domain.Entities.Favorite>();
            builder.Ignore<PurrfectMatch.Domain.Entities.GoodWith>();
            builder.Ignore<PurrfectMatch.Domain.Entities.HealthRecord>();
            builder.Ignore<PurrfectMatch.Domain.Entities.HealthStatus>();
            builder.Ignore<PurrfectMatch.Domain.Entities.Pet>();
            builder.Ignore<PurrfectMatch.Domain.Entities.PetGoodWith>();
            builder.Ignore<PurrfectMatch.Domain.Entities.PetPhoto>();
            builder.Ignore<PurrfectMatch.Domain.Entities.Post>();
            builder.Ignore<PurrfectMatch.Domain.Entities.Review>();
            builder.Ignore<PurrfectMatch.Domain.Entities.Shelter>();
            builder.Ignore<PurrfectMatch.Domain.Entities.ShelterFollower>();
            builder.Ignore<PurrfectMatch.Domain.Entities.ShelterManager>();
            builder.Ignore<PurrfectMatch.Domain.Entities.Species>();
            builder.Ignore<PurrfectMatch.Domain.Entities.Tag>();
            builder.Ignore<PurrfectMatch.Domain.Entities.UserProfile>();
        }
    }

    public class ApplicationIdentityDbContextFactory : IDesignTimeDbContextFactory<ApplicationIdentityDbContext>
    {
        public ApplicationIdentityDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<ApplicationIdentityDbContext>();
            optionsBuilder.UseSqlServer("Server=tcp:purrfectmatch.database.windows.net,1433;Database=PurrfectMatchDb ;User ID=darsa-azuredb;Password=2xK&-#,x^C%p?d2;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;");

            return new ApplicationIdentityDbContext(optionsBuilder.Options);
        }
    }
}