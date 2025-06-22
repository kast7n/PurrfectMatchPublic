using System.ComponentModel.DataAnnotations;

namespace PurrfectMatch.Domain.Entities
{
    public partial class PetGoodWith
    {
        [Key]
        public int PetGoodWithId { get; set; }

        public int PetId { get; set; }

        public int GoodWithId { get; set; }

        public virtual GoodWith GoodWith { get; set; } = null!;

        public virtual Pet Pet { get; set; } = null!;
    }
}


