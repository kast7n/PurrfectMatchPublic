using CsvHelper.Configuration.Attributes;

namespace PurrfectMatch.Shared.DTOs.Pets
{
    public class PetCsvImportModel
    {
        [Name("Name")]
        public string Name { get; set; } = string.Empty;

        [Name("Age")]
        public string Age { get; set; } = string.Empty;

        [Name("Gender")]
        public string Gender { get; set; } = string.Empty;

        [Name("Size")]
        public string Size { get; set; } = string.Empty;

        [Name("Description")]
        public string Description { get; set; } = string.Empty;

        [Name("Species")]
        public string? Species { get; set; }

        [Name("Breed")]
        public string? Breed { get; set; }

        [Name("ActivityLevel")]
        public string? ActivityLevel { get; set; }

        [Name("HealthStatus")]
        public string? HealthStatus { get; set; }

        [Name("Color")]
        public string? Color { get; set; }

        [Name("CoatLength")]
        public string? CoatLength { get; set; }

        [Name("Microchipped")]
        public string? Microchipped { get; set; }

        public CreatePetDto ToCreatePetDto(int shelterId)
        {
            return new CreatePetDto
            {
                ShelterId = shelterId,
                Name = Name,
                Age = Age,
                Gender = Gender,
                Size = Size,
                Description = Description,
                Species = Species,
                Breed = Breed,
                ActivityLevel = ActivityLevel,
                HealthStatus = HealthStatus,
                Color = Color,
                CoatLength = CoatLength,
                Microchipped = Microchipped?.ToLowerInvariant() == "true"
            };
        }
    }
}