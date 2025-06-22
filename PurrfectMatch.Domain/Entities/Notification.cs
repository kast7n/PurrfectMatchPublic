using System.ComponentModel.DataAnnotations;

namespace PurrfectMatch.Domain.Entities
{
    public partial class Notification
    {
        [Key]
        public int NotificationId { get; set; }

        public string UserId { get; set; } = null!;

        public string NotificationType { get; set; } = null!;

        public string Title { get; set; } = null!;

        public string Message { get; set; } = null!;

        public bool IsRead { get; set; }

        public DateTime CreatedAt { get; set; }

        public string? ActionUrl { get; set; }

        public virtual User User { get; set; } = null!;
    }
}


