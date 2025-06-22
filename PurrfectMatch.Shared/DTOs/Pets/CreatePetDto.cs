namespace PurrfectMatch.Shared.DTOs.Pets
{
    public class CreatePetDto
    {
        public int ShelterId { get; set; }

        // IDs for existing attributes
        public int? SpeciesId { get; set; }
        public int? BreedId { get; set; }
        public int? ActivityLevelId { get; set; }
        public int? HealthStatusId { get; set; }
        public int? ColorId { get; set; }
        public int? CoatLengthId { get; set; }

        // String names for new attributes
        public string? Species { get; set; }
        public string? Breed { get; set; }
        public string? ActivityLevel { get; set; }
        public string? HealthStatus { get; set; }
        public string? Color { get; set; }
        public string? CoatLength { get; set; }

        // Required pet properties
        public required string Name { get; set; }
        public required string Age { get; set; }
        public required string Gender { get; set; }
        public required string Size { get; set; }
        public bool? Microchipped { get; set; }
        public required string Description { get; set; }
    }
}
