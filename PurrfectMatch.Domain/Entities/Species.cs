using System.ComponentModel.DataAnnotations;

namespace PurrfectMatch.Domain.Entities
{
    public partial class Species
    {
        [Key]
        public int SpeciesId { get; set; }

        public string Name { get; set; } = null!;

        public virtual ICollection<Breed> Breeds { get; set; } = new List<Breed>();

        public virtual ICollection<Pet> Pets { get; set; } = new List<Pet>();
    }
}


