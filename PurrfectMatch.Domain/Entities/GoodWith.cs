using System.ComponentModel.DataAnnotations;

namespace PurrfectMatch.Domain.Entities
{
    public partial class GoodWith
    {
        [Key]
        public int GoodWithId { get; set; }

        public string GoodWith1 { get; set; } = null!;

        public virtual ICollection<PetGoodWith> PetGoodWiths { get; set; } = new List<PetGoodWith>();
    }
}
