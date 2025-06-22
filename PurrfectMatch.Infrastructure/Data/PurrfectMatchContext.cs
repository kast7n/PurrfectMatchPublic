using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Infrastructure.Data.Interceptors;

namespace PurrfectMatch.Infrastructure.Data;

public partial class PurrfectMatchContext : DbContext
{
    private readonly AuditInterceptor? _auditInterceptor;

    public PurrfectMatchContext(DbContextOptions<PurrfectMatchContext> options, AuditInterceptor? auditInterceptor = null)
        : base(options)
    {
        _auditInterceptor = auditInterceptor;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (_auditInterceptor != null)
        {
            optionsBuilder.AddInterceptors(_auditInterceptor);
        }

        // optionsBuilder.LogTo(Console.WriteLine, Microsoft.Extensions.Logging.LogLevel.Information);
    }

    public virtual DbSet<ActivityLevel> ActivityLevels { get; set; }
    public virtual DbSet<Address> Addresses { get; set; }
    public virtual DbSet<AdoptionApplication> AdoptionApplications { get; set; }
    public virtual DbSet<ApplicationNotification> ApplicationNotifications { get; set; }
    public virtual DbSet<Breed> Breeds { get; set; }
    public virtual DbSet<CoatLength> CoatLengths { get; set; }
    public virtual DbSet<Color> Colors { get; set; }
    public virtual DbSet<Donation> Donations { get; set; }
    public virtual DbSet<Favorite> Favorites { get; set; }
    public virtual DbSet<GoodWith> GoodWiths { get; set; }
    public virtual DbSet<HealthRecord> HealthRecords { get; set; }
    public virtual DbSet<HealthStatus> HealthStatuses { get; set; }
    public virtual DbSet<Log> Logs { get; set; }
    public virtual DbSet<Notification> Notifications { get; set; }
    public virtual DbSet<Pet> Pets { get; set; }
    public virtual DbSet<PetGoodWith> PetGoodWiths { get; set; }
    public virtual DbSet<PetPhoto> PetPhotos { get; set; }
    public virtual DbSet<Post> Posts { get; set; }
    public virtual DbSet<Review> Reviews { get; set; }
    public virtual DbSet<Shelter> Shelters { get; set; }
    public virtual DbSet<ShelterCreationRequest> ShelterCreationRequests { get; set; }    public virtual DbSet<ShelterFollower> ShelterFollowers { get; set; }
    public virtual DbSet<ShelterManager> ShelterManagers { get; set; }
    public virtual DbSet<Species> Species { get; set; }
    public virtual DbSet<Tag> Tags { get; set; }
    public virtual DbSet<UserProfile> UserProfiles { get; set; }    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configure User entity to map to AspNetUsers table
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("AspNetUsers");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("Id");
        });

        modelBuilder.Entity<ActivityLevel>(entity =>
        {
            entity.HasKey(e => e.ActivityLevelId).HasName("PK__Activity__D95C31A85F31229A");

            entity.HasIndex(e => e.Activity, "UQ__Activity__685755E71F7E1F0F").IsUnique();

            entity.Property(e => e.Activity).HasMaxLength(50);
        });

        modelBuilder.Entity<Address>(entity =>
        {
            entity.HasKey(e => e.AddressId).HasName("PK__Addresse__091C2AFB84481526");

            entity.Property(e => e.City).HasMaxLength(100);
            entity.Property(e => e.Country).HasMaxLength(100);
            entity.Property(e => e.GoogleMapLink).HasMaxLength(500);
            entity.Property(e => e.PostalCode).HasMaxLength(20);
            entity.Property(e => e.State).HasMaxLength(100);
            entity.Property(e => e.Street).HasMaxLength(255);
        });        modelBuilder.Entity<AdoptionApplication>(entity =>
        {
            entity.HasKey(e => e.ApplicationId).HasName("PK__Adoption__C93A4C99CC2EEE5F");

            entity.HasIndex(e => e.IsDeleted, "IX_AdoptionApplications_IsDeleted");

            entity.HasIndex(e => e.PetId, "IX_AdoptionApplications_Pet");

            entity.HasIndex(e => e.Status, "IX_AdoptionApplications_Status");

            entity.HasIndex(e => e.UserId, "IX_AdoptionApplications_User");

            entity.Property(e => e.ApplicationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DeletedByUserId).HasMaxLength(450);
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValue("Pending");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");            // When a pet is deleted, all its adoption applications should be cascade deleted
            entity.HasOne(d => d.Pet).WithMany(p => p.AdoptionApplications)
                .HasForeignKey(d => d.PetId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__AdoptionA__PetId__607251E5");            // When a user is deleted, cascade delete their adoption applications
            entity.HasOne(d => d.User).WithMany(u => u.AdoptionApplications)
                .HasForeignKey(d => d.UserId)
                .HasPrincipalKey(u => u.Id)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();
                
            // DeletedByUser can be null, so restrict delete if referenced
            entity.HasOne(d => d.DeletedByUser).WithMany()
                .HasForeignKey(d => d.DeletedByUserId)
                .OnDelete(DeleteBehavior.Restrict);
        });        modelBuilder.Entity<ApplicationNotification>(entity =>
        {
            entity.HasKey(e => e.NotificationId).HasName("PK__Applicat__20CF2E123E92AD60");

            entity.HasIndex(e => e.ApplicationId, "IX_ApplicationNotifications_Application");

            entity.HasIndex(e => new { e.ReceiverId, e.IsRead }, "IX_ApplicationNotifications_Receiver");

            entity.Property(e => e.ActionUrl).HasMaxLength(255);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Message).HasMaxLength(500);
            entity.Property(e => e.NotificationType).HasMaxLength(20);
            entity.Property(e => e.SenderId).HasMaxLength(450);
            entity.Property(e => e.Title).HasMaxLength(100);

            // When an adoption application is deleted, cascade delete its notifications
            entity.HasOne(d => d.Application).WithMany(p => p.ApplicationNotifications)
                .HasForeignKey(d => d.ApplicationId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__Applicati__Appli__625A9A57");

            // When sender user is deleted, set sender to null (optional reference)
            entity.HasOne(d => d.Sender)
                .WithMany()
                .HasForeignKey(d => d.SenderId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("FK_ApplicationNotifications_SenderId");

            // When receiver user is deleted, cascade delete their notifications
            entity.HasOne(d => d.Receiver)
                .WithMany()
                .HasForeignKey(d => d.ReceiverId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_ApplicationNotifications_ReceiverId");
        });        modelBuilder.Entity<Breed>(entity =>
        {
            entity.HasKey(e => e.BreedId).HasName("PK__Breeds__D1E9AE9DA01D2E4A");

            entity.HasIndex(e => new { e.SpeciesId, e.Name }, "UQ_Breed_Species").IsUnique();

            entity.Property(e => e.Name).HasMaxLength(100);

            // When a species is deleted, cascade delete all its breeds
            entity.HasOne(d => d.Species).WithMany(p => p.Breeds)
                .HasForeignKey(d => d.SpeciesId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__Breeds__SpeciesI__5224328E");
        });

        modelBuilder.Entity<CoatLength>(entity =>
        {
            entity.HasKey(e => e.CoatLengthId).HasName("PK__CoatLeng__DDA9ACBBE5447B84");

            entity.HasIndex(e => e.Length, "UQ__CoatLeng__88949D7045BD91A0").IsUnique();

            entity.Property(e => e.Length).HasMaxLength(50);
        });

        modelBuilder.Entity<Color>(entity =>
        {
            entity.HasKey(e => e.ColorId).HasName("PK__Colors__8DA7674DF0CA5D3B");

            entity.HasIndex(e => e.Color1, "UQ__Colors__E11D384567A4032D").IsUnique();

            entity.Property(e => e.Color1)
                .HasMaxLength(50)
                .HasColumnName("Color");
        });        modelBuilder.Entity<Donation>(entity =>
        {
            entity.HasKey(e => e.DonationId).HasName("PK__Donation__C5082EFB6AE093E1");

            entity.HasIndex(e => e.UserId, "IX_Donations_User");

            entity.Property(e => e.Amount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");            // When a user is deleted, cascade delete their donations
            entity.HasOne(d => d.User).WithMany(u => u.Donations)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();
        });modelBuilder.Entity<Favorite>(entity =>
        {
            entity.HasKey(e => e.FavoriteId).HasName("PK__Favorite__CE74FAD5631395C8");

            entity.HasIndex(e => new { e.UserId, e.PetId }, "Favorites_index_9").IsUnique();

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            // When a pet is deleted, cascade delete all favorites for that pet
            entity.HasOne(d => d.Pet).WithMany(p => p.Favorites)
                .HasForeignKey(d => d.PetId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__Favorites__PetId__5E8A0973");                  // When a user is deleted, cascade delete all their favorites
            entity.HasOne(d => d.User).WithMany(u => u.Favorites)
                .HasForeignKey(d => d.UserId)
                .HasPrincipalKey(u => u.Id)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();
        });

        modelBuilder.Entity<GoodWith>(entity =>
        {
            entity.HasKey(e => e.GoodWithId).HasName("PK__GoodWith__D65840948C3C34ED");

            entity.ToTable("GoodWith");

            entity.HasIndex(e => e.GoodWith1, "UQ__GoodWith__2C7BACDE9E2A69C5").IsUnique();

            entity.Property(e => e.GoodWith1)
                .HasMaxLength(50)
                .HasColumnName("GoodWith");
        });        modelBuilder.Entity<HealthRecord>(entity =>
        {
            entity.HasKey(e => e.RecordId).HasName("PK__HealthRe__FBDF78E93FD2B339");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            // When a pet is deleted, cascade delete all its health records
            entity.HasOne(d => d.Pet).WithMany(p => p.HealthRecords)
                .HasForeignKey(d => d.PetId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__HealthRec__PetId__662B2B3B");
        });

        modelBuilder.Entity<HealthStatus>(entity =>
        {
            entity.HasKey(e => e.HealthStatusId).HasName("PK__HealthSt__F9C58EDF81A3E5B5");

            entity.HasIndex(e => e.Status, "UQ__HealthSt__3A15923F844E533C").IsUnique();

            entity.Property(e => e.Status).HasMaxLength(50);
        });

        modelBuilder.Entity<Log>(entity =>
        {
            entity.HasKey(e => e.LogId).HasName("PK__Logs__5E548648A004AC44");

            entity.Property(e => e.Action).HasMaxLength(50);
            entity.Property(e => e.ChangeDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ChangedByUserId).HasMaxLength(450);
            entity.Property(e => e.EntityId).HasMaxLength(450);
            entity.Property(e => e.EntityType).HasMaxLength(50);
        });        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.NotificationId).HasName("PK__Notifica__20CF2E12BFAA4FC7");

            entity.Property(e => e.ActionUrl).HasMaxLength(255);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Message).HasMaxLength(500);
            entity.Property(e => e.NotificationType).HasMaxLength(50);
            entity.Property(e => e.Title).HasMaxLength(100);
            entity.Property(e => e.UserId).HasMaxLength(450);            // When a user is deleted, cascade delete their notifications
            entity.HasOne(d => d.User).WithMany(u => u.Notifications)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();
        });modelBuilder.Entity<Pet>(entity =>
        {
            entity.HasKey(e => e.PetId).HasName("PK__Pets__48E53862C0BABF5E");

            entity.HasIndex(e => e.IsAdopted, "IX_Pets_AdoptionStatus");

            entity.HasIndex(e => e.BreedId, "IX_Pets_Breed");

            entity.HasIndex(e => e.IsDeleted, "IX_Pets_IsDeleted");

            entity.HasIndex(e => e.ShelterId, "IX_Pets_Shelter");

            entity.HasIndex(e => e.SpeciesId, "IX_Pets_Species");

            entity.Property(e => e.Age).HasMaxLength(50);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DeletedByUserId).HasMaxLength(450);
            entity.Property(e => e.Gender).HasMaxLength(10);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.Size).HasMaxLength(50);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            // Activity Level: Restrict delete if referenced (lookup data should be preserved)
            entity.HasOne(d => d.ActivityLevel).WithMany(p => p.Pets)
                .HasForeignKey(d => d.ActivityLevelId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_Pet_ActivityLevel_ActivityLevelId");

            // Breed: Restrict delete if referenced (lookup data should be preserved)
            entity.HasOne(d => d.Breed).WithMany(p => p.Pets)
                .HasForeignKey(d => d.BreedId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_Pet_Breed_BreedId");

            // Coat Length: Restrict delete if referenced (lookup data should be preserved)
            entity.HasOne(d => d.CoatLength).WithMany(p => p.Pets)
                .HasForeignKey(d => d.CoatLengthId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_Pet_CoatLength_CoatLengthId");

            // Color: Restrict delete if referenced (lookup data should be preserved)
            entity.HasOne(d => d.Color).WithMany(p => p.Pets)
                .HasForeignKey(d => d.ColorId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_Pet_Color_ColorId");

            // Health Status: Restrict delete if referenced (lookup data should be preserved)
            entity.HasOne(d => d.HealthStatus).WithMany(p => p.Pets)
                .HasForeignKey(d => d.HealthStatusId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_Pet_HealthStatus_HealthStatusId");

            // Shelter: Restrict delete if pets exist (should transfer pets before deleting shelter)
            entity.HasOne(d => d.Shelter).WithMany(p => p.Pets)
                .HasForeignKey(d => d.ShelterId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_Pet_Shelter_ShelterId");

            // Species: Restrict delete if referenced (lookup data should be preserved)
            entity.HasOne(d => d.Species).WithMany(p => p.Pets)
                .HasForeignKey(d => d.SpeciesId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_Pet_Species_SpeciesId");
                
            // DeletedByUser can be null, so set null if user is deleted
            entity.HasOne(d => d.DeletedByUser).WithMany()
                .HasForeignKey(d => d.DeletedByUserId)
                .OnDelete(DeleteBehavior.SetNull);
        });        modelBuilder.Entity<PetGoodWith>(entity =>
        {
            entity.HasKey(e => e.PetGoodWithId).HasName("PK__PetGoodW__A08EE2A2885C6014");

            entity.ToTable("PetGoodWith");

            // When a GoodWith category is deleted, cascade delete all pet associations
            entity.HasOne(d => d.GoodWith).WithMany(p => p.PetGoodWiths)
                .HasForeignKey(d => d.GoodWithId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__PetGoodWi__GoodW__5BAD9CC8");

            // When a pet is deleted, cascade delete all its GoodWith associations
            entity.HasOne(d => d.Pet).WithMany(p => p.PetGoodWiths)
                .HasForeignKey(d => d.PetId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__PetGoodWi__PetId__5AB9788F");
        });        modelBuilder.Entity<PetPhoto>(entity =>
        {
            entity.HasKey(e => e.PhotoId).HasName("PK__PetPhoto__21B7B5E27B24F1A3");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            // When a pet is deleted, cascade delete all its photos
            entity.HasOne(d => d.Pet).WithMany(p => p.PetPhotos)
                .HasForeignKey(d => d.PetId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__PetPhotos__PetId__5CA1C101");
        });

        modelBuilder.Entity<Post>(entity =>
        {
            entity.HasKey(e => e.PostId).HasName("PK__Posts__AA126018A855846B");

            entity.HasIndex(e => e.PostType, "IX_Posts_PostType");

            entity.HasIndex(e => e.UserId, "IX_WebsitePosts_User");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.PostType).HasMaxLength(50);
            entity.Property(e => e.Title).HasMaxLength(255);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");            entity.HasOne(d => d.Shelter).WithMany(p => p.Posts)
                .HasForeignKey(d => d.ShelterId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__Posts__ShelterId__69FBBC1F");            // When a user is deleted, cascade delete their posts
            entity.HasOne(d => d.User).WithMany(u => u.Posts)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(d => d.Tags).WithMany(p => p.Posts)
                .UsingEntity<Dictionary<string, object>>(
                    "PostTag",
                    r => r.HasOne<Tag>().WithMany()
                        .HasForeignKey("TagId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .HasConstraintName("FK__PostTags__TagId__6BE40491"),
                    l => l.HasOne<Post>().WithMany()
                        .HasForeignKey("PostId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .HasConstraintName("FK__PostTags__PostId__6AEFE058"),
                    j =>
                    {
                        j.HasKey("PostId", "TagId").HasName("PK__PostTags__7C45AF821CFFCEB1");
                        j.ToTable("PostTags");
                    });
        });        modelBuilder.Entity<Review>(entity =>
        {
            entity.HasKey(e => e.ReviewId).HasName("PK__Reviews__74BC79CE94CBD7D6");

            entity.HasIndex(e => e.ShelterId, "IX_Reviews_Shelter");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UserId).HasMaxLength(450);            entity.HasOne(d => d.Shelter).WithMany(p => p.Reviews)
                .HasForeignKey(d => d.ShelterId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Reviews__Shelter__681373Ad");

            entity.HasOne(d => d.User).WithMany(u => u.Reviews)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();
        });

        modelBuilder.Entity<Shelter>(entity =>
        {
            entity.HasKey(e => e.ShelterId).HasName("PK__Shelters__E2CDF55486D47A30");

            entity.HasIndex(e => e.IsDeleted, "IX_Shelters_IsDeleted");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DeletedByUserId).HasMaxLength(450);
            entity.Property(e => e.DonationUrl).HasMaxLength(255);
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.Name).HasMaxLength(255);
            entity.Property(e => e.PhoneNumber).HasMaxLength(20);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Website).HasMaxLength(255);            entity.HasOne(d => d.Address).WithMany(p => p.Shelters)
                .HasForeignKey(d => d.AddressId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK__Shelters__Addres__4B7734FF");

            // DeletedByUser can be null, so set null if user is deleted
            entity.HasOne(d => d.DeletedByUser).WithMany()
                .HasForeignKey(d => d.DeletedByUserId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<ShelterCreationRequest>(entity =>
        {
            entity.HasKey(e => e.RequestId).HasName("PK__ShelterC__33A8517AC9295433");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.RequestDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.RequestedAddress).HasMaxLength(255);
            entity.Property(e => e.ShelterName).HasMaxLength(255);
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .HasDefaultValue("Pending");            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UserId).HasMaxLength(450);            // When a user is deleted, cascade delete their shelter creation requests
            entity.HasOne(d => d.User).WithMany(u => u.ShelterCreationRequests)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();
        });

        modelBuilder.Entity<ShelterFollower>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.ShelterId }).HasName("PK__ShelterF__49A41319E2310B7B");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");            entity.HasOne(d => d.Shelter).WithMany(p => p.ShelterFollowers)
                .HasForeignKey(d => d.ShelterId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__ShelterFo__Shelt__503BEA1C");            // When a user is deleted, cascade delete their shelter follows
            entity.HasOne(d => d.User).WithMany(u => u.ShelterFollowers)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();
        });

        modelBuilder.Entity<ShelterManager>(entity =>
        {
            entity.HasKey(e => new { e.ShelterId, e.UserId }).HasName("PK__ShelterM__33B57990C5290F31");

            entity.HasIndex(e => e.ShelterId, "IX_ShelterManagers_Shelter");

            entity.HasIndex(e => e.UserId, "IX_ShelterManagers_User");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");            entity.HasOne(d => d.Shelter).WithMany(p => p.ShelterManagers)
                .HasForeignKey(d => d.ShelterId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__ShelterMa__Shelt__4D5F7D71");            // When a user is deleted, cascade delete their shelter manager roles
            entity.HasOne(d => d.User).WithMany(u => u.ShelterManagers)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();
        });

        modelBuilder.Entity<Species>(entity =>
        {
            entity.HasKey(e => e.SpeciesId).HasName("PK__Species__A938045FEF287D30");

            entity.HasIndex(e => e.Name, "UQ__Species__737584F666C6F646").IsUnique();

            entity.Property(e => e.Name).HasMaxLength(100);
        });

        modelBuilder.Entity<Tag>(entity =>
        {
            entity.HasKey(e => e.TagId).HasName("PK__Tags__657CF9ACEB35B375");

            entity.HasIndex(e => e.TagName, "UQ__Tags__BDE0FD1DFCE85067").IsUnique();

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.TagName).HasMaxLength(50);
        });

        modelBuilder.Entity<UserProfile>(entity =>
        {
            entity.HasKey(e => e.UserProfileId).HasName("PK__UserProf__9E267F62045FFEC5");

            entity.HasIndex(e => e.UserId, "UQ__UserProf__1788CC4DAE6AE66B").IsUnique();

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.CurrentPetsOwned).HasDefaultValue(0);
            entity.Property(e => e.ExperienceWithPets).HasMaxLength(50);
            entity.Property(e => e.HousingType).HasMaxLength(50);
            entity.Property(e => e.Job).HasMaxLength(255);
            entity.Property(e => e.Location).HasMaxLength(255);
            entity.Property(e => e.PhoneNumber).HasMaxLength(20);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");            entity.HasOne(d => d.User).WithOne(p => p.UserProfile)
                .HasForeignKey<UserProfile>(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__UserProfi__UserI__6CD828CA");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

public class PurrfectMatchContextFactory : IDesignTimeDbContextFactory<PurrfectMatchContext>
{
    public PurrfectMatchContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<PurrfectMatchContext>();
        optionsBuilder.UseSqlServer("Server=tcp:purrfectmatch.database.windows.net,1433;Database=PurrfectMatchDb ;User ID=darsa-azuredb;Password=2xK&-#,x^C%p?d2;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;");

        return new PurrfectMatchContext(optionsBuilder.Options);
    }
}
