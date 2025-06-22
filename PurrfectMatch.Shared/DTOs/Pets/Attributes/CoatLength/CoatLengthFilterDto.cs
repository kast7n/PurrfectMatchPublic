using PurrfectMatch.Shared.DTOs.Base;

namespace PurrfectMatch.Shared.DTOs.Pets.Attributes.CoatLength
{
    public class CoatLengthFilterDto : BaseFilterDto
    {
        public string Length { get; set; } = string.Empty;
    }
}
