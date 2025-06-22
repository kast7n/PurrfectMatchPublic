using System.ComponentModel.DataAnnotations;

namespace PurrfectMatch.Domain.Entities
{
    public partial class Tag
    {
        [Key]
        public int TagId { get; set; }

        public string TagName { get; set; } = null!;

        public DateTime CreatedAt { get; set; }

        public virtual ICollection<Post> Posts { get; set; } = new List<Post>();
    }
}


