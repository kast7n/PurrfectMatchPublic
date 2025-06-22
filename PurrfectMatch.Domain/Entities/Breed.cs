using System.ComponentModel.DataAnnotations;

namespace PurrfectMatch.Domain.Entities
{
    public partial class Breed
    {
        [Key]
        public int BreedId { get; set; }

        public int SpeciesId { get; set; }

        public string Name { get; set; } = null!;

        public virtual ICollection<Pet> Pets { get; set; } = new List<Pet>();

        public virtual Species Species { get; set; } = null!;
    }
}


