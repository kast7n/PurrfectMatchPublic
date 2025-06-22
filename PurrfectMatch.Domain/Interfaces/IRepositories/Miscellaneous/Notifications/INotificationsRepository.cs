using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using PurrfectMatch.Domain.Entities;

namespace PurrfectMatch.Domain.Interfaces.IRepositories.Miscellaneous.Notifications;

public interface INotificationsRepository
{
    Task<IEnumerable<Notification>> GetNotificationsByUserIdAsync(string userId);
}
