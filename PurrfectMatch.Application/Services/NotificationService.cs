using PurrfectMatch.Application.Interfaces.Services;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Shared.DTOs.Notifications;
using AutoMapper;
using System;
using System.Threading.Tasks;

namespace PurrfectMatch.Application.Services
{
    public class NotificationService : INotificationService
    {
        private readonly IBaseRepository<Notification> _notificationRepository;
        private readonly ISignalRNotificationService? _signalRService;
        private readonly IMapper _mapper;

        public NotificationService(
            IBaseRepository<Notification> notificationRepository, 
            IMapper mapper,
            ISignalRNotificationService? signalRService = null)
        {
            _notificationRepository = notificationRepository;
            _mapper = mapper;
            _signalRService = signalRService;
        }

        public async Task CreateNotificationAsync(string userId, string notificationType, string title, string message, string? actionUrl = null)
        {
            var newNotification = new Notification
            {
                UserId = userId,
                NotificationType = notificationType,
                Title = title,
                Message = message,
                IsRead = false,
                CreatedAt = DateTime.UtcNow,
                ActionUrl = actionUrl
            };

            await _notificationRepository.CreateAsync(newNotification);
            await _notificationRepository.SaveChangesAsync();

            // Send real-time notification if SignalR service is available
            if (_signalRService != null)
            {
                var notificationDto = _mapper.Map<NotificationDto>(newNotification);
                await _signalRService.SendNotificationToUserAsync(userId, notificationDto);
            }
        }
    }
}