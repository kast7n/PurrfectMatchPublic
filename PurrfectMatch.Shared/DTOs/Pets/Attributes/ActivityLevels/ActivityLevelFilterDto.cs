using PurrfectMatch.Shared.DTOs.Base;

namespace PurrfectMatch.Shared.DTOs.Pets.Attributes.ActivityLevels
{
    public class ActivityLevelFilterDto : BaseFilterDto
    {
        public string Activity { get; set; } = string.Empty;
    }
}

