using System.ComponentModel.DataAnnotations;

namespace PurrfectMatch.Shared.DTOs.Reviews
{    public class CreateReviewDto
    {
        // UserId is not included here as it will be set by the controller from the authenticated user's token

        [Required]
        public int ShelterId { get; set; }

        [Required]
        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5")]
        public int Rating { get; set; }

        [MaxLength(1000, ErrorMessage = "Comment cannot exceed 1000 characters")]
        public string? Comment { get; set; }
    }
}
