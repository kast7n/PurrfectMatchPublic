using System.ComponentModel.DataAnnotations;

namespace PurrfectMatch.Shared.DTOs.Shelters
{
    public class UpdateShelterApplicationStatusDto
    {
        [Required(ErrorMessage = "IsApproved status is required.")]
        public bool IsApproved { get; set; }
        
        public string? Remarks { get; set; }
    }
}
