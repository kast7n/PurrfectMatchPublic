using PurrfectMatch.Shared.DTOs.Base;

namespace PurrfectMatch.Shared.DTOs.Posts
{
    public class TagFilterDto : BaseFilterDto
    {
        public string? TagName { get; set; }
        public DateTime? CreatedAfter { get; set; }
        public DateTime? CreatedBefore { get; set; }
    }
}
