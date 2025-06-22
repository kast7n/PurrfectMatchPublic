using System.ComponentModel.DataAnnotations;

namespace PurrfectMatch.Domain.Entities
{
    public partial class HealthRecord
    {
        [Key]
        public int RecordId { get; set; }

        public int PetId { get; set; }

        public string? VaccinationDetails { get; set; }

        public string? MedicalHistory { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public virtual Pet Pet { get; set; } = null!;
    }
}


