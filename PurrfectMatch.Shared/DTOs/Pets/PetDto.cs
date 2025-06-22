namespace PurrfectMatch.Shared.DTOs.Pets
{    public class PetDto
    {
        public int PetId { get; set; }
        public int ShelterId { get; set; }
        public string ShelterName { get; set; } = string.Empty; // Initialized to avoid null
        public string SpeciesName { get; set; } = string.Empty; // Initialized to avoid null
        public string BreedName { get; set; } = string.Empty; // Initialized to avoid null
        public string Name { get; set; } = string.Empty; // Initialized to avoid null
        public string? Age { get; set; }
        public string? Gender { get; set; }
        public string? Size { get; set; }
        public string CoatLength { get; set; } = string.Empty; // Initialized to avoid null
        public string Color { get; set; } = string.Empty; // Initialized to avoid null
        public string ActivityLevel { get; set; } = string.Empty; // Initialized to avoid null
        public string HealthStatus { get; set; } = string.Empty; // Initialized to avoid null
        public bool Microchipped { get; set; }
        public string? Description { get; set; }
        public bool IsAdopted { get; set; }
        public bool IsDeleted { get; set; }
        public DateTimeOffset? DeletedAt { get; set; }
        public string? DeletedByUserId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<string> PhotoUrls { get; set; } = new(); // Initialized to avoid null
    }
}