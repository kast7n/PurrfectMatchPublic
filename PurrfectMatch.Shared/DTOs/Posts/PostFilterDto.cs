using PurrfectMatch.Shared.DTOs.Base;

namespace PurrfectMatch.Shared.DTOs.Posts
{
    public class PostFilterDto : BaseFilterDto
    {
        public string? PostType { get; set; }
        public int? ShelterId { get; set; }
        public string? UserId { get; set; }
        public string? Title { get; set; }
        public string? Content { get; set; }
        public int? TagId { get; set; }
        public DateTime? CreatedAfter { get; set; }
        public DateTime? CreatedBefore { get; set; }
    }
}
