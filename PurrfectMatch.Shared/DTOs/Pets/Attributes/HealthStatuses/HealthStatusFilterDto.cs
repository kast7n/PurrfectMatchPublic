using PurrfectMatch.Shared.DTOs.Base;

namespace PurrfectMatch.Shared.DTOs.Pets.Attributes.HealthStatuses
{
    public class HealthStatusFilterDto : BaseFilterDto
    {
        public string Status { get; set; } = string.Empty;
    }
}

