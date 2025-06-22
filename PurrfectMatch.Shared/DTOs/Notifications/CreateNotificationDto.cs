namespace PurrfectMatch.Shared.DTOs.Notifications
{
    public class CreateNotificationDto
    {
        public string UserId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string NotificationType { get; set; } = string.Empty;
        public string? ActionUrl { get; set; }
    }
}