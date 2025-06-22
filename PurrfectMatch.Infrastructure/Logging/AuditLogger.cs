using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces;
using PurrfectMatch.Infrastructure.Data;

namespace PurrfectMatch.Infrastructure.Logging
{
    public class AuditLogger : IAuditLogger
    {
        private readonly IServiceProvider _serviceProvider;

        public AuditLogger(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public async Task LogActivityAsync(string entityType, string entityId, string action,
            string userId, string? oldValues, string? newValues, string? details = null)
        {
            // Create a new scope and resolve the context
            using var scope = _serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<PurrfectMatchContext>();

            var log = new Log
            {
                EntityType = entityType,
                EntityId = entityId,
                Action = action,
                ChangedByUserId = userId,
                OldValues = oldValues,
                NewValues = newValues,
                Details = details,
                ChangeDate = DateTime.UtcNow,
            };

            await context.Logs.AddAsync(log);
            await context.SaveChangesAsync();
        }
    }
}