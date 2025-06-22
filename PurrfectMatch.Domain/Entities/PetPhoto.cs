using System.ComponentModel.DataAnnotations;

namespace PurrfectMatch.Domain.Entities
{
    public partial class PetPhoto
    {
        [Key]
        public int PhotoId { get; set; }

        public int PetId { get; set; }

        public string PhotoUrl { get; set; } = null!;

        public DateTime CreatedAt { get; set; }

        public virtual Pet Pet { get; set; } = null!;
    }
}


