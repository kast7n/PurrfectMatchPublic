using System.ComponentModel.DataAnnotations;

namespace PurrfectMatch.Domain.Entities
{
    public partial class Shelter
    {
        [Key]
        public int ShelterId { get; set; }

        public string Name { get; set; } = null!;

        public int? AddressId { get; set; }

        public string? PhoneNumber { get; set; }

        public string? Email { get; set; }

        public string? Website { get; set; }

        public string? DonationUrl { get; set; }

        public string? Description { get; set; }

        public bool IsDeleted { get; set; }

        public DateTimeOffset? DeletedAt { get; set; }

        public string? DeletedByUserId { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public virtual Address? Address { get; set; }

        public virtual User? DeletedByUser { get; set; }

        public virtual ICollection<Pet> Pets { get; set; } = new List<Pet>();

        public virtual ICollection<Post> Posts { get; set; } = new List<Post>();

        public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

        public virtual ICollection<ShelterFollower> ShelterFollowers { get; set; } = new List<ShelterFollower>();

        public virtual ICollection<ShelterManager> ShelterManagers { get; set; } = new List<ShelterManager>();
    }
}


