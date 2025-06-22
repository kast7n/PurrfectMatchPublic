using System.ComponentModel.DataAnnotations;

namespace PurrfectMatch.Domain.Entities
{
    public partial class UserProfile
    {
        [Key]
        public int UserProfileId { get; set; }

        public string UserId { get; set; } = null!;

        public string? PhoneNumber { get; set; }

        public string? PhotoUrl { get; set; }

        public int? Age { get; set; }

        public string? Job { get; set; }

        public int? CurrentPetsOwned { get; set; }

        public string? Location { get; set; }

        public string? GeneralInfo { get; set; }

        public string? HousingType { get; set; }

        public bool? HasYard { get; set; }

        public string? Allergies { get; set; }

        public string? ExperienceWithPets { get; set; }        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public virtual User User { get; set; } = null!;

    }
}


