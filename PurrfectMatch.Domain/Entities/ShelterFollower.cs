

using System.ComponentModel.DataAnnotations;

namespace PurrfectMatch.Domain.Entities
{
    public partial class ShelterFollower
    {
        [Key]
        public int ShelterFollowerId { get; set; }
        public string UserId { get; set; } = null!;

        public int ShelterId { get; set; }

        public DateTime CreatedAt { get; set; }

        public virtual Shelter Shelter { get; set; } = null!;

        public virtual User User { get; set; } = null!;
    }
}


