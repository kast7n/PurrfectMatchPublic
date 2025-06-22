namespace PurrfectMatch.Shared.DTOs.Pets
{
    public class UpdatePetDto
    {
        public int SpeciesId { get; set; }
        public int BreedId { get; set; }
        public required string Name { get; set; }
        public string? Age { get; set; }
        public string? Gender { get; set; }
        public string? Size { get; set; }
        public int CoatLengthId { get; set; }
        public int ColorId { get; set; }
        public int ActivityLevelId { get; set; }
        public int HealthStatusId { get; set; }
        public bool Microchipped { get; set; }
        public required string Description { get; set; }
        public bool? IsAdopted { get; set; }
    }
}