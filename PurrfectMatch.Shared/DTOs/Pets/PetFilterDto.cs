using PurrfectMatch.Shared.DTOs.Base;

namespace PurrfectMatch.Shared.DTOs.Pets
{
    public class PetFilterDto : BaseFilterDto
    {
        // Basic Filters
        public string? Name { get; set; }
        public int? SpeciesId { get; set; }
        public int? BreedId { get; set; }
        public string? Size { get; set; }
        public string? Age { get; set; } // Retained age property
        public string? Gender { get; set; } // Retained gender property

        // Advanced Attributes
        public int? CoatLengthId { get; set; }
        public int? ColorId { get; set; }
        public int? ActivityLevelId { get; set; }
        public int? HealthStatusId { get; set; }

        // Boolean Flags
        public bool? Microchipped { get; set; }
        public bool? IsAdopted { get; set; }
        public bool? IsDeleted { get; set; }

        // Location/Shelter
        public int? ShelterId { get; set; }
        public string? ShelterName { get; set; }
        public string? City { get; set; }
        public int? RadiusKm { get; set; } // For proximity searches

        // GoodWith Tags (e.g., "children", "otherPets")
        public List<string>? GoodWith { get; set; }
    }
}
