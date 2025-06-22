using System;

namespace PurrfectMatch.Shared.DTOs.Notifications
{
    public class NotificationDto
    {
        public int NotificationId { get; set; }
        public string? UserId { get; set; }
        public string? NotificationType { get; set; }
        public string? Title { get; set; }
        public string? Message { get; set; }
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? ActionUrl { get; set; }
    }
}