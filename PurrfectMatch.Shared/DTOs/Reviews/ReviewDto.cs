using System;

namespace PurrfectMatch.Shared.DTOs.Reviews
{
    public class ReviewDto
    {
        public int ReviewId { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public int ShelterId { get; set; }
        public string ShelterName { get; set; } = string.Empty;
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
