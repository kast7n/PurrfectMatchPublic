using System.ComponentModel.DataAnnotations;

namespace PurrfectMatch.Domain.Entities
{
    public partial class ShelterCreationRequest
    {
        [Key]
        public int RequestId { get; set; }

        public string UserId { get; set; } = null!;

        public string ShelterName { get; set; } = null!;

        public string? RequestedAddress { get; set; }

        public int AddressId { get; set; }

        public DateTime RequestDate { get; set; }

        public string Status { get; set; } = null!;

        public string? Remarks { get; set; }

        public bool? IsApproved { get; set; } // Indicates whether the application is approved

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public virtual User User { get; set; } = null!;
        public virtual Address Address { get; set; } = null!;
    }
}


