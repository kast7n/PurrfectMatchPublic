using Microsoft.AspNetCore.SignalR;
using PurrfectMatch.Api.Hubs;
using PurrfectMatch.Application.Interfaces.Services;
using PurrfectMatch.Shared.DTOs.Notifications;

namespace PurrfectMatch.Api.Services
{
    public class SignalRNotificationService : ISignalRNotificationService
    {
        private readonly IHubContext<NotificationHub> _hubContext;

        public SignalRNotificationService(IHubContext<NotificationHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task SendNotificationToUserAsync(string userId, NotificationDto notification)
        {
            await _hubContext.Clients.Group($"user_{userId}")
                .SendAsync("ReceiveNotification", notification);
        }

        public async Task SendNotificationToAllAsync(NotificationDto notification)
        {
            await _hubContext.Clients.All
                .SendAsync("ReceiveNotification", notification);
        }

        public async Task NotifyNotificationUpdatedAsync(string userId, NotificationDto notification)
        {
            await _hubContext.Clients.Group($"user_{userId}")
                .SendAsync("NotificationUpdated", notification);
        }

        public async Task NotifyNotificationDeletedAsync(string userId, int notificationId)
        {
            await _hubContext.Clients.Group($"user_{userId}")
                .SendAsync("NotificationDeleted", notificationId);
        }
    }
}
