using System.ComponentModel.DataAnnotations;

namespace PurrfectMatch.Domain.Entities
{
    public partial class AdoptionApplication
    {
        [Key]
        public int ApplicationId { get; set; }

        public string UserId { get; set; } = null!;

        public int PetId { get; set; }

        public DateTime ApplicationDate { get; set; }

        public string Status { get; set; } = null!;

        public bool IsDeleted { get; set; }

        public DateTimeOffset? DeletedAt { get; set; }

        public string? DeletedByUserId { get; set; }

        public DateTime CreatedAt { get; set; }        public DateTime UpdatedAt { get; set; }

        public virtual ICollection<ApplicationNotification> ApplicationNotifications { get; set; } = new List<ApplicationNotification>();

        public virtual User? DeletedByUser { get; set; }

        public virtual Pet Pet { get; set; } = null!;

        public virtual User User { get; set; } = null!;

        
    }
}


