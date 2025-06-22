using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using PurrfectMatch.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace PurrfectMatch.Infrastructure.Data.Interceptors
{
    public class AuditInterceptor(IAuditLogger auditLogger, ICurrentUserService currentUserService) : SaveChangesInterceptor
    {
        private readonly IAuditLogger _auditLogger = auditLogger;
        private readonly ICurrentUserService _currentUserService = currentUserService;

        public override async ValueTask<InterceptionResult<int>> SavingChangesAsync(DbContextEventData eventData, InterceptionResult<int> result, CancellationToken cancellationToken = default)
        {
            var context = eventData.Context;
            if(context == null) return await base.SavingChangesAsync(eventData, result, cancellationToken);

            var userId = _currentUserService.UserId ?? "System";
            var logs = new List<Task>();

            //Logging only important tables to not bloat the logs table
            var tablesToLog = new List<string>
            {
                "AdoptionApplication",
                "ShelterCreationRequest",
                "Pet",
                "UserProfile",
                "Shelter",
                "Review",
                "Donation"
            };

            foreach(var entry in context.ChangeTracker.Entries())
            {
                if(entry.State == EntityState.Added || entry.State == EntityState.Modified || entry.State == EntityState.Deleted)
                {
                    var entityType = entry.Entity.GetType().Name;
                    if (tablesToLog.Contains(entityType))
                    {
                        var entityId = entry.Properties.FirstOrDefault(p => p.Metadata.IsPrimaryKey())?.CurrentValue?.ToString();
                        var action = entry.State.ToString();

                        //used incase of update
                        var oldValues = entry.State == EntityState.Modified ?
                            JsonSerializer.Serialize(entry.OriginalValues.Properties.ToDictionary(p => p.Name, p => entry.OriginalValues[p])) : null;

                        var newValues = JsonSerializer.Serialize(entry.CurrentValues.Properties.ToDictionary(p => p.Name, p => entry.CurrentValues[p]));

                        logs.Add(_auditLogger.LogActivityAsync(entityType, entityId!, action, userId, oldValues, newValues));
                    }
                }
            }
            await Task.WhenAll(logs);
            return await base.SavingChangesAsync(eventData, result, cancellationToken);
        }
    }
}
