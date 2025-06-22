using PurrfectMatch.Shared.DTOs.Base;

namespace PurrfectMatch.Shared.DTOs.Shelters
{
    public class ShelterFilterDto : BaseFilterDto
    {
        public string? Name { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public string? Website { get; set; }
        public string? DonationUrl { get; set; }

        // Add other criteria as needed.
    }
}