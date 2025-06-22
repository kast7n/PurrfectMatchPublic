

using System.ComponentModel.DataAnnotations;

namespace PurrfectMatch.Domain.Entities
{
    public partial class ShelterManager
    {
        [Key]
        public int ShelterManagerId { get; set; }
        public int ShelterId { get; set; }

        public string UserId { get; set; } = null!;

        public DateTime CreatedAt { get; set; }

        public virtual Shelter Shelter { get; set; } = null!;
        public virtual User User { get; set; } = null!;

        
    }
}


