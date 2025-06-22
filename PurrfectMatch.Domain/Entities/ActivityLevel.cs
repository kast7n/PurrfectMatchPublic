using System.ComponentModel.DataAnnotations;

namespace PurrfectMatch.Domain.Entities
{
    public partial class ActivityLevel
    {
        [Key]
        public int ActivityLevelId { get; set; }

        public string Activity { get; set; } = null!;

        public virtual ICollection<Pet> Pets { get; set; } = new List<Pet>();
    }
}
