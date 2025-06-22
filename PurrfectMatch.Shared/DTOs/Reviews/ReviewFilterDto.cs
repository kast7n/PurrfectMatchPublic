using PurrfectMatch.Shared.DTOs.Base;

namespace PurrfectMatch.Shared.DTOs.Reviews
{
    public class ReviewFilterDto : BaseFilterDto
    {
        public int? ShelterId { get; set; }
        public string? UserId { get; set; }
        public int? MinRating { get; set; }
        public int? MaxRating { get; set; }
    }
}
