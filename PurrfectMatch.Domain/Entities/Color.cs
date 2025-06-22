using System.ComponentModel.DataAnnotations;

namespace PurrfectMatch.Domain.Entities
{
    public partial class Color
    {
        [Key]
        public int ColorId { get; set; }

        public string Color1 { get; set; } = null!;

        public virtual ICollection<Pet> Pets { get; set; } = new List<Pet>();
    }
}


