

using PurrfectMatch.Shared.DTOs.Base;

namespace PurrfectMatch.Shared.DTOs.Pets.Attributes.Breeds
{
    public class BreedFilterDto : BaseFilterDto
    {
        public string? Name { get; set; }
        public int? SpeciesId { get; set; }
    }
}
