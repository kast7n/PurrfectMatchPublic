using System.ComponentModel.DataAnnotations;

namespace PurrfectMatch.Domain.Entities {
    public partial class Address
    {
        [Key]
        public int AddressId { get; set; }

        public string? Street { get; set; }

        public string? City { get; set; }

        public string? State { get; set; }

        public string? PostalCode { get; set; }

        public string? Country { get; set; }

        public string? GoogleMapLink { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public virtual ICollection<Shelter> Shelters { get; set; } = new List<Shelter>();
    }

}



