namespace PurrfectMatch.Domain.Entities
{
    public partial class Favorite
    {
        public int FavoriteId { get; set; }

        public string UserId { get; set; } = null!;

        public int PetId { get; set; }

        public DateTime CreatedAt { get; set; }

        public virtual Pet Pet { get; set; } = null!;

        public virtual User User { get; set; } = null!;
    }
}


