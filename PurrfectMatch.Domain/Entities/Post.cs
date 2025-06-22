

using System.ComponentModel.DataAnnotations;

namespace PurrfectMatch.Domain.Entities
{
    public partial class Post
    {
        [Key]
        public int PostId { get; set; }

        public string PostType { get; set; } = null!;

        public int? ShelterId { get; set; }

        public string UserId { get; set; } = null!;

        public string Title { get; set; } = null!;

        public string Content { get; set; } = null!;

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public virtual Shelter? Shelter { get; set; }

        public virtual User User { get; set; } = null!;

        public virtual ICollection<Tag> Tags { get; set; } = new List<Tag>();
    }
}


