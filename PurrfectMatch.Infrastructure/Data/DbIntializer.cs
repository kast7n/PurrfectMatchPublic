using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PurrfectMatch.Domain.Entities;
using Microsoft.Extensions.DependencyInjection;

namespace PurrfectMatch.Infrastructure.Data;

public static class DbInitializer
{
    public static void InitDb(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();

        // Retrieve the PurrfectMatchContext
        var context = scope.ServiceProvider.GetRequiredService<PurrfectMatchContext>()
            ?? throw new InvalidOperationException("Failed to retrieve PurrfectMatchContext");

        // Retrieve the ApplicationIdentityDbContext
        var identityContext = scope.ServiceProvider.GetRequiredService<ApplicationIdentityDbContext>()
            ?? throw new InvalidOperationException("Failed to retrieve ApplicationIdentityDbContext");

        // Retrieve UserManager and RoleManager
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>()
            ?? throw new InvalidOperationException("Failed to retrieve UserManager");

        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>()
            ?? throw new InvalidOperationException("Failed to retrieve RoleManager");

        // Seed data
        SeedData(context, identityContext, userManager, roleManager).Wait();
    }

    private static async Task SeedData(
        PurrfectMatchContext context,
        ApplicationIdentityDbContext identityContext,
        UserManager<User> userManager,
        RoleManager<IdentityRole> roleManager)
    {
        // Apply migrations
        await context.Database.MigrateAsync();
        await identityContext.Database.MigrateAsync();        // Seed roles
        if (!roleManager.Roles.Any())
        {
            var roles = new[] { "Admin", "Member", "ShelterManager" };
            foreach (var role in roles)
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }

        // Seed users
        if (!userManager.Users.Any())
        {
            var user = new User
            {
                UserName = "bob@test.com",
                Email = "bob@test.com",
                EmailConfirmed = true
            };

            await userManager.CreateAsync(user, "Pa$$w0rd");
            await userManager.AddToRoleAsync(user, "Member");

            var admin = new User
            {
                UserName = "admin@test.com",
                Email = "admin@test.com",
                EmailConfirmed = true
            };

            await userManager.CreateAsync(admin, "Pa$$w0rd");
            await userManager.AddToRolesAsync(admin, new[] { "Admin", "Member" });
        }

        // Seed GoodWith options
        if (!context.GoodWiths.Any())
        {
            var goodWith = new List<GoodWith>
            {
                new GoodWith { GoodWith1 = "Children" },
                new GoodWith { GoodWith1 = "Dogs" },
                new GoodWith { GoodWith1 = "Cats" },
                new GoodWith { GoodWith1 = "Other Animals" },
                new GoodWith { GoodWith1 = "Seniors" }
            };

            context.GoodWiths.AddRange(goodWith);
        }

        // Seed activity levels
        if (!context.ActivityLevels.Any())
        {
            var activityLevels = new List<ActivityLevel>
            {
                new ActivityLevel { Activity = "Low" },
                new ActivityLevel { Activity = "Moderate" },
                new ActivityLevel { Activity = "High" },
                new ActivityLevel { Activity = "Very High" }
            };

            context.ActivityLevels.AddRange(activityLevels);
        }

        // Seed species first (required for breeds)
        if (!context.Species.Any())
        {
            var species = new List<Species>
            {
                new Species { Name = "Dog" },
                new Species { Name = "Cat" },
                new Species { Name = "Bird" },
                new Species { Name = "Rabbit" },
                new Species { Name = "Fish" }
            };

            context.Species.AddRange(species);
            await context.SaveChangesAsync();
        }

        // Seed breeds (needs species to exist first)
        if (!context.Breeds.Any())
        {
            var breeds = new List<Breed>
            {
                new Breed { Name = "Labrador Retriever", SpeciesId = context.Species.First(s => s.Name == "Dog").SpeciesId },
                new Breed { Name = "Persian", SpeciesId = context.Species.First(s => s.Name == "Cat").SpeciesId },
                new Breed { Name = "Parakeet", SpeciesId = context.Species.First(s => s.Name == "Bird").SpeciesId },
                new Breed { Name = "Angora", SpeciesId = context.Species.First(s => s.Name == "Rabbit").SpeciesId },
                new Breed { Name = "Goldfish", SpeciesId = context.Species.First(s => s.Name == "Fish").SpeciesId }
            };

            context.Breeds.AddRange(breeds);
        }

        // Seed coat lengths
        if (!context.CoatLengths.Any())
        {
            var coatLengths = new List<CoatLength>
            {
                new CoatLength { Length = "Short" },
                new CoatLength { Length = "Medium" },
                new CoatLength { Length = "Long" },
                new CoatLength { Length = "Curly" },
                new CoatLength { Length = "Hairless" }
            };

            context.CoatLengths.AddRange(coatLengths);
        }

        // Seed colors
        if (!context.Colors.Any())
        {
            var colors = new List<Color>
            {
                new Color { Color1 = "Black" },
                new Color { Color1 = "White" },
                new Color { Color1 = "Brown" },
                new Color { Color1 = "Gray" },
                new Color { Color1 = "Golden" }
            };

            context.Colors.AddRange(colors);
        }

        // Seed health statuses
        if (!context.HealthStatuses.Any())
        {
            var healthStatuses = new List<HealthStatus>
            {
                new HealthStatus { Status = "Healthy" },
                new HealthStatus { Status = "Injured" },
                new HealthStatus { Status = "Sick" },
                new HealthStatus { Status = "Recovering" },
                new HealthStatus { Status = "Critical" }
            };

            context.HealthStatuses.AddRange(healthStatuses);
        }

        // Save all attribute entities before creating shelters and pets
        await context.SaveChangesAsync();

        // Seed shelters before pets
        if (!context.Shelters.Any())
        {
            var shelters = new List<Shelter>
            {
                new Shelter { Name = "Happy Tails Shelter" },
                new Shelter { Name = "Paws and Claws Rescue" },
                new Shelter { Name = "Furry Friends Haven" },
                new Shelter { Name = "Safe Haven for Pets" },
                new Shelter { Name = "Animal Rescue Center" }
            };

            context.Shelters.AddRange(shelters);
            await context.SaveChangesAsync();
        }

        // Seed pets last since they depend on all other entities
        if (!context.Pets.Any())
        {
            var pets = new List<Pet>
            {
                new Pet {
                    Name = "Buddy",
                    Age = "2 years",
                    Gender = "Male",
                    Size = "Medium",
                    Description = "Friendly and energetic dog",
                    SpeciesId = context.Species.First(s => s.Name == "Dog").SpeciesId,
                    BreedId = context.Breeds.First(b => b.Name == "Labrador Retriever").BreedId,
                    CoatLengthId = context.CoatLengths.First(c => c.Length == "Short").CoatLengthId,
                    ColorId = context.Colors.First(c => c.Color1 == "Golden").ColorId,
                    ActivityLevelId = context.ActivityLevels.First(a => a.Activity == "High").ActivityLevelId,
                    HealthStatusId = context.HealthStatuses.First(h => h.Status == "Healthy").HealthStatusId,
                    ShelterId = context.Shelters.First().ShelterId,
                    Microchipped = true
                }
            };

            context.Pets.AddRange(pets);

            // Save pets first so we can add their relationships
            await context.SaveChangesAsync();

            // Add GoodWith relationships for the first pet
            var firstPet = pets[0];
            var goodWithChildren = context.GoodWiths.First(g => g.GoodWith1 == "Children");
            var goodWithDogs = context.GoodWiths.First(g => g.GoodWith1 == "Dogs");

            var petGoodWiths = new List<PetGoodWith>
            {
                new PetGoodWith { PetId = firstPet.PetId, GoodWithId = goodWithChildren.GoodWithId },
                new PetGoodWith { PetId = firstPet.PetId, GoodWithId = goodWithDogs.GoodWithId }
            };            context.PetGoodWiths.AddRange(petGoodWiths);
        }        // Seed tags
        if (!context.Tags.Any())
        {
            var tags = new List<Tag>
            {
                new Tag { TagName = "health", CreatedAt = DateTime.UtcNow },
                new Tag { TagName = "learning", CreatedAt = DateTime.UtcNow },
                new Tag { TagName = "guides", CreatedAt = DateTime.UtcNow },
                new Tag { TagName = "news", CreatedAt = DateTime.UtcNow }
            };

            context.Tags.AddRange(tags);
            await context.SaveChangesAsync();
        }

        // Save all changes
        await context.SaveChangesAsync();
    }
}
