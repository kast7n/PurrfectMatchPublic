using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PurrfectMatch.Domain.Interfaces
{
    public interface IAuditLogger
    {
        Task LogActivityAsync(string entityType, string entityId, string action,
                      string userId, string? oldValues, string? newValues, string? details = null);
    }
}
