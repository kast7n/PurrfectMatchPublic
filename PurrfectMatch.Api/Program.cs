using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces;
using PurrfectMatch.Infrastructure.Data;
using PurrfectMatch.Infrastructure.Data.Interceptors;
using PurrfectMatch.Infrastructure.Logging;
using PurrfectMatch.Infrastructure.Repositories.Base;
using PurrfectMatch.Infrastructure.Services;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Domain.Interfaces.Services;
using PurrfectMatch.Domain.Interfaces.IRepositories;
using PurrfectMatch.Infrastructure.Repositories;
using Serilog;
using PurrfectMatch.Infrastructure.Repositories.User;
using PurrfectMatch.Domain.Interfaces.IRepositories.Miscellaneous.Donations;
using PurrfectMatch.Domain.Interfaces.IRepositories.Miscellaneous.Notifications;
using PurrfectMatch.Infrastructure.Repositories.Miscellaneous.Donations;
using PurrfectMatch.Infrastructure.Repositories.Miscellaneous.Notifications;
using PurrfectMatch.Application.Services;
using PurrfectMatch.Domain.Interfaces.IRepositories.Posts;
using PurrfectMatch.Infrastructure.Repositories.Posts;
using PurrfectMatch.Api.Hubs;
using PurrfectMatch.Api.Services;
using PurrfectMatch.Application.Interfaces.Services;
using PurrfectMatch.Application.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Serilog.Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/log-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// -------------------- Database Configuration --------------------
builder.Services.AddDbContext<ApplicationIdentityDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddDbContext<PurrfectMatchContext>((serviceProvider, options) =>
{
    var auditInterceptor = serviceProvider.GetRequiredService<AuditInterceptor>();
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
           .AddInterceptors(auditInterceptor);
});

// -------------------- Identity Configuration --------------------
builder.Services.AddIdentityApiEndpoints<User>(opt => {
    opt.User.RequireUniqueEmail = true;
}).AddRoles<IdentityRole>()
  .AddEntityFrameworkStores<ApplicationIdentityDbContext>();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.SameSite = SameSiteMode.None; // Allow cross-origin cookies
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // Ensure cookie is only sent over HTTPS
});

builder.Services.AddAuthorization();

// -------------------- CORS Configuration --------------------
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? new string[0];

// Log the allowed origins for debugging
Console.WriteLine($"Allowed Origins Count: {allowedOrigins.Length}");
foreach (var origin in allowedOrigins)
{
    Console.WriteLine($"Allowed Origin: {origin}");
}

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policyBuilder =>
    {
        if (allowedOrigins.Length > 0)
        {
            policyBuilder.WithOrigins(allowedOrigins)
                         .AllowAnyHeader()
                         .AllowAnyMethod()
                         .AllowCredentials();
        }
        else
        {
            // Fallback for when no origins are configured
            policyBuilder.AllowAnyOrigin()
                         .AllowAnyHeader()
                         .AllowAnyMethod();
        }
    });
});

// -------------------- Dependency Injection --------------------
// Generic repositories
builder.Services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));
builder.Services.AddScoped(typeof(IBaseSoftDeleteRepository<>), typeof(BaseSoftDeleteRepository<>));
builder.Services.AddSingleton<EmailTemplateService>();
builder.Services.AddSingleton<EmailSender>();
builder.Services.AddSingleton<Microsoft.AspNetCore.Identity.IEmailSender<User>, EmailSender>();
builder.Services.AddScoped<PurrfectMatch.Application.Interfaces.Services.IEmailSender, PurrfectMatchEmailSender>();

// Specific repositories
builder.Services.AddScoped<IBaseRepository<ActivityLevel>, BaseRepository<ActivityLevel>>();
builder.Services.AddScoped<IBaseRepository<Address>, BaseRepository<Address>>();
builder.Services.AddScoped<IBaseRepository<ApplicationNotification>, BaseRepository<ApplicationNotification>>();
builder.Services.AddScoped<IBaseRepository<Breed>, BaseRepository<Breed>>();
builder.Services.AddScoped<IBaseRepository<CoatLength>, BaseRepository<CoatLength>>();
builder.Services.AddScoped<IBaseRepository<Color>, BaseRepository<Color>>();
builder.Services.AddScoped<IBaseRepository<Favorite>, BaseRepository<Favorite>>();
builder.Services.AddScoped<IBaseRepository<GoodWith>, BaseRepository<GoodWith>>();
builder.Services.AddScoped<IBaseRepository<HealthStatus>, BaseRepository<HealthStatus>>();
builder.Services.AddScoped<IBaseRepository<Notification>, BaseRepository<Notification>>();
builder.Services.AddScoped<IBaseRepository<PurrfectMatch.Domain.Entities.Log>, BaseRepository<PurrfectMatch.Domain.Entities.Log>>();
builder.Services.AddScoped<IBaseRepository<PetGoodWith>, BaseRepository<PetGoodWith>>();
builder.Services.AddScoped<IBaseRepository<Post>, BaseRepository<Post>>();
builder.Services.AddScoped<IBaseRepository<Review>, BaseRepository<Review>>();
builder.Services.AddScoped<IBaseRepository<ShelterCreationRequest>, BaseRepository<ShelterCreationRequest>>();
builder.Services.AddScoped<IBaseRepository<ShelterFollower>, BaseRepository<ShelterFollower>>();
builder.Services.AddScoped<IBaseRepository<ShelterManager>, BaseRepository<ShelterManager>>();
builder.Services.AddScoped<IBaseRepository<Species>, BaseRepository<Species>>();
builder.Services.AddScoped<IBaseRepository<Tag>, BaseRepository<Tag>>();

// Post and Tag specific repositories
builder.Services.AddScoped<IPostRepository, PostRepository>();
builder.Services.AddScoped<ITagRepository, TagRepository>();
builder.Services.AddScoped<IUserProfileRepository, UserProfileRepository>();

// Soft delete repositories
builder.Services.AddScoped<IBaseSoftDeleteRepository<Shelter>, BaseSoftDeleteRepository<Shelter>>();
builder.Services.AddScoped<IBaseSoftDeleteRepository<Pet>, BaseSoftDeleteRepository<Pet>>();
builder.Services.AddScoped<IBaseSoftDeleteRepository<AdoptionApplication>, BaseSoftDeleteRepository<AdoptionApplication>>();

builder.Services.AddScoped<INotificationsRepository, NotificationsRepository>();
builder.Services.AddScoped<IDonationsRepository, DonationsRepository>();
builder.Services.AddScoped<IHealthRecordRepository, HealthRecordRepository>();

builder.Services.AddScoped<IFollowerRepository, FollowerRepository>();
builder.Services.AddScoped<IReviewRepository, ReviewRepository>();

// MANAGER-BASED DEPENDENCY INJECTION
builder.Services.AddScoped<PurrfectMatch.Application.Managers.AddressesManager>();
builder.Services.AddScoped<PurrfectMatch.Application.Managers.AdoptionApplicationsManager>();
builder.Services.AddScoped<PurrfectMatch.Application.Managers.DonationsManager>();
builder.Services.AddScoped<PurrfectMatch.Application.Managers.NotificationsManager>();
builder.Services.AddScoped<PurrfectMatch.Application.Managers.Pets.PetsManager>();
builder.Services.AddScoped<PurrfectMatch.Application.Managers.Pets.Attributes.ActivityLevelsManager>();
builder.Services.AddScoped<PurrfectMatch.Application.Managers.Pets.Attributes.BreedsManager>();
builder.Services.AddScoped<PurrfectMatch.Application.Managers.Pets.Attributes.ColorsManager>();
builder.Services.AddScoped<PurrfectMatch.Application.Managers.Pets.Attributes.CoatLengthsManager>();
builder.Services.AddScoped<PurrfectMatch.Application.Managers.Pets.Attributes.HealthRecordsManager>();
builder.Services.AddScoped<PurrfectMatch.Application.Managers.Pets.Attributes.HealthStatusesManager>();
builder.Services.AddScoped<PurrfectMatch.Application.Managers.Pets.Attributes.SpeciesManager>();
builder.Services.AddScoped<PurrfectMatch.Application.Managers.SheltersManager>();
builder.Services.AddScoped<PurrfectMatch.Application.Managers.UsersManager>();
builder.Services.AddScoped<PurrfectMatch.Application.Managers.ReviewsManager>();
builder.Services.AddScoped<PurrfectMatch.Application.Managers.Posts.PostsManager>();
builder.Services.AddScoped<PurrfectMatch.Application.Managers.Posts.TagsManager>();


builder.Services.AddScoped<FollowerService>();

// Register DependencyLoggingHandler for HTTP client calls
builder.Services.AddHttpClient("DefaultClient").AddHttpMessageHandler<DependencyLoggingHandler>();

// Register DependencyLoggingHandler in DI
builder.Services.AddTransient<DependencyLoggingHandler>();

// Register BlobStorageService with required configuration
builder.Services.AddScoped<IBlobStorageService>(provider =>
{
    var configuration = provider.GetRequiredService<IConfiguration>();
    var blobStorageConnectionString = configuration.GetValue<string>("BlobStorage:ConnectionString")
        ?? throw new InvalidOperationException("BlobStorage:ConnectionString is not configured.");
    var containerName = configuration.GetValue<string>("BlobStorage:ContainerName")
        ?? throw new InvalidOperationException("BlobStorage:ContainerName is not configured.");
    return new BlobStorageService(blobStorageConnectionString, containerName);
});

// Services
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
builder.Services.AddScoped<IAuditLogger, AuditLogger>();
builder.Services.AddScoped<AuditInterceptor>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<PurrfectMatch.Application.Interfaces.Services.INotificationService, PurrfectMatch.Application.Services.NotificationService>();
builder.Services.AddScoped<ISignalRNotificationService, SignalRNotificationService>();
builder.Services.AddScoped<PurrfectMatch.Application.Interfaces.IStripeService, PurrfectMatch.Infrastructure.Services.StripeService>();

// -------------------- SignalR Configuration --------------------
builder.Services.AddSignalR();

// AutoMapper - register all profiles at once
builder.Services.AddAutoMapper(
    typeof(Program).Assembly,
    typeof(PurrfectMatch.Shared.MappingProfiles.CoatLengthProfile).Assembly
    );

// -------------------- API Configuration --------------------
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.MaxDepth = 64;
        options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
    });

// -------------------- Swagger Configuration --------------------
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.CustomSchemaIds(type => type.FullName?.Replace(".", "_"));
});

var app = builder.Build();

// Ensure Serilog is properly disposed on shutdown
app.Lifetime.ApplicationStopped.Register(Serilog.Log.CloseAndFlush);

// -------------------- Middleware Pipeline --------------------
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseSerilogRequestLogging();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

// Add RequestResponseLoggingMiddleware to the pipeline
app.UseMiddleware<RequestResponseLoggingMiddleware>();

// Add PerformanceLoggingMiddleware to the pipeline
app.UseMiddleware<PerformanceLoggingMiddleware>();

app.MapControllers();
app.MapGroup("api").MapIdentityApi<User>();

// Map SignalR Hub
app.MapHub<NotificationHub>("/notificationHub");

// Initialize database
try
{
    using var scope = app.Services.CreateScope();
    DbInitializer.InitDb(scope.ServiceProvider);
}
catch (Exception ex)
{
    var logger = app.Services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred while initializing the database");
}

app.Run();
