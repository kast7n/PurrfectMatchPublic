using PurrfectMatch.Shared.DTOs.Notifications;

namespace PurrfectMatch.Application.Interfaces.Services
{
    public interface ISignalRNotificationService
    {
        Task SendNotificationToUserAsync(string userId, NotificationDto notification);
        Task SendNotificationToAllAsync(NotificationDto notification);
        Task NotifyNotificationUpdatedAsync(string userId, NotificationDto notification);
        Task NotifyNotificationDeletedAsync(string userId, int notificationId);
    }
}
