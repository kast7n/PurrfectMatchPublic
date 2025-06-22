using System.ComponentModel.DataAnnotations;

namespace PurrfectMatch.Shared.DTOs.Users
{    public class UserProfileDto
    {
        public string? userId { get; set; }

        [Phone]
        public string? PhoneNumber { get; set; }

        [Url]
        public string? PhotoUrl { get; set; }

        [Range(18, 100)]
        public int? Age { get; set; }

        public string? Job { get; set; }

        public int CurrentPetsOwned { get; set; } = 0;        public UserAddressDto? Address { get; set; } // Nested DTO like Shelter

        [StringLength(500)]
        public string? GeneralInfo { get; set; }

        [StringLength(50)]
        public string? HousingType { get; set; }

        public bool HasYard { get; set; }        [StringLength(200)]
        public string? Allergies { get; set; }

        [StringLength(100)]
        public string? ExperienceWithPets { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class UserAddressDto // Matching AddressDto pattern
    {
        public string? Street { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? PostalCode { get; set; }
        public string? Country { get; set; }
        [Url]
        public string? GoogleMapLink { get; set; }
    }
}