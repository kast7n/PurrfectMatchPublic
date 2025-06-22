using PurrfectMatch.Shared.DTOs.Base;

namespace PurrfectMatch.Shared.DTOs.AdoptionApplications
{    public class AdoptionApplicationFilterDto : BaseFilterDto
    {
        // Basic Filters
        public string? UserId { get; set; }
        public int? PetId { get; set; }
        public int? ShelterId { get; set; }
        public string? Status { get; set; }
        
        // Date Filters
        public DateTime? ApplicationDateAfter { get; set; }
        public DateTime? ApplicationDateBefore { get; set; }
        public DateTime? CreatedAfter { get; set; }
        public DateTime? CreatedBefore { get; set; }
        
        // Boolean Flags
        public bool? IsDeleted { get; set; }
    }
}