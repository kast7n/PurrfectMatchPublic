using System.ComponentModel.DataAnnotations;
using PurrfectMatch.Shared.DTOs.Addresses;

namespace PurrfectMatch.Shared.DTOs.Shelters
{    public class CreateShelterApplicationDto
    {
        // UserId will be set from JWT token in the controller, so it's not required in the request
        public string? UserId { get; set; }

        [Required(ErrorMessage = "Shelter name is required.")]
        [MaxLength(255, ErrorMessage = "Shelter name cannot exceed 255 characters.")]
        public string? ShelterName { get; set; }

        [Required(ErrorMessage = "Address information is required.")]
        public AddressDto? Address { get; set; }

        [MaxLength(500, ErrorMessage = "Remarks cannot exceed 500 characters.")]
        public string? Remarks { get; set; }

    }

    
}