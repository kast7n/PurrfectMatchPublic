using System.ComponentModel.DataAnnotations;

namespace PurrfectMatch.Domain.Entities
{
    public partial class Pet
    {
        [Key]
        public int PetId { get; set; }

        public int ShelterId { get; set; }

        public int SpeciesId { get; set; }

        public int BreedId { get; set; }

        public string Name { get; set; } = null!;

        public string? Age { get; set; }

        public string? Gender { get; set; }

        public string? Size { get; set; }

        public int CoatLengthId { get; set; }

        public int ColorId { get; set; }

        public int ActivityLevelId { get; set; }

        public int HealthStatusId { get; set; }

        public bool Microchipped { get; set; }

        public string? Description { get; set; }

        public bool IsAdopted { get; set; }

        public bool IsDeleted { get; set; }

        public DateTimeOffset? DeletedAt { get; set; }

        public string? DeletedByUserId { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public virtual ActivityLevel? ActivityLevel { get; set; }

        public virtual ICollection<AdoptionApplication> AdoptionApplications { get; set; } = new List<AdoptionApplication>();

        public virtual Breed? Breed { get; set; }

        public virtual CoatLength? CoatLength { get; set; }

        public virtual Color? Color { get; set; }

        public virtual User? DeletedByUser { get; set; }

        public virtual ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();

        public virtual ICollection<HealthRecord> HealthRecords { get; set; } = new List<HealthRecord>();

        public virtual HealthStatus? HealthStatus { get; set; }

        public virtual ICollection<PetGoodWith> PetGoodWiths { get; set; } = new List<PetGoodWith>();

        public virtual ICollection<PetPhoto> PetPhotos { get; set; } = new List<PetPhoto>();

        public virtual Shelter Shelter { get; set; } = null!;

        public virtual Species Species { get; set; } = null!;
    }
}
