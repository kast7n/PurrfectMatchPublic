using System.ComponentModel.DataAnnotations;

namespace PurrfectMatch.Shared.DTOs.Shelters
{    public class ShelterDto
    {
        public int ShelterId { get; set; }

        [Required]
        public string? Name { get; set; }

        public AddressDto? Address { get; set; } // Nested AddressDto

        public string? PhoneNumber { get; set; }

        [EmailAddress]
        public string? Email { get; set; }

        public string? Website { get; set; }

        public string? DonationUrl { get; set; }

        public string? Description { get; set; }
    }

    public class AddressDto
    {
        public string? Street { get; set; }

        public string? City { get; set; }

        public string? State { get; set; }
        public string? PostalCode { get; set; }

        public string? Country { get; set; }

        public string? GoogleMapLink { get; set; }
    }
}