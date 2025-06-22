using System.ComponentModel.DataAnnotations;

namespace PurrfectMatch.Domain.Entities
{
    public partial class ApplicationNotification
    {
        [Key]
        public int NotificationId { get; set; }

        public int ApplicationId { get; set; }

        public string SenderId { get; set; } = null!;

        public string ReceiverId { get; set; } = null!;

        public string NotificationType { get; set; } = null!;

        public string Title { get; set; } = null!;

        public string Message { get; set; } = null!;

        public bool IsRead { get; set; }

        public DateTime CreatedAt { get; set; }

        public string? ActionUrl { get; set; }
        public virtual User Sender { get; set; } = null!;
        public virtual User Receiver { get; set; } = null!;

        public virtual AdoptionApplication Application { get; set; } = null!;

    }

}

