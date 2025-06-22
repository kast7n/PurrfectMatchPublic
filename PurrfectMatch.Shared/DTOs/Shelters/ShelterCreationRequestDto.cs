
using System;

namespace PurrfectMatch.Shared.DTOs.Shelters
{
public class ShelterCreationRequestDto
    {
        public int RequestId { get; set; }
        public string? UserId { get; set; }
        public string? ShelterName { get; set; }
        public string? RequestedAddress { get; set; }
        public DateTime RequestDate { get; set; }
        public string? Status { get; set; }
        public string? Remarks { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}