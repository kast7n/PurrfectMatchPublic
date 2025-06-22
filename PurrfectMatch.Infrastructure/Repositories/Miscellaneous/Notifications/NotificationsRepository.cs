using Microsoft.EntityFrameworkCore;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Miscellaneous.Notifications;
using PurrfectMatch.Infrastructure.Data;
using PurrfectMatch.Infrastructure.Repositories.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PurrfectMatch.Infrastructure.Repositories.Miscellaneous.Notifications
{
    public class NotificationsRepository : BaseRepository<Notification>, INotificationsRepository
    {
        private readonly PurrfectMatchContext _dbContext;

        public NotificationsRepository(PurrfectMatchContext dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<Notification>> GetNotificationsByUserIdAsync(string userId)
        {
            return await _dbContext.Notifications
                                   .Where(n => n.UserId == userId)
                                   .ToListAsync();
        }
    }
}
