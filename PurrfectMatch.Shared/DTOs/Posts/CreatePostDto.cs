using System.ComponentModel.DataAnnotations;

namespace PurrfectMatch.Shared.DTOs.Posts
{
    public class CreatePostDto
    {
        [Required]
        [StringLength(50, ErrorMessage = "Post type cannot exceed 50 characters")]
        public string PostType { get; set; } = string.Empty;
        
        public int? ShelterId { get; set; }
        
        public string UserId { get; set; } = string.Empty; // This will be set by the controller from authenticated user
        
        [Required]
        [StringLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        [StringLength(5000, ErrorMessage = "Content cannot exceed 5000 characters")]
        public string Content { get; set; } = string.Empty;
        
        public List<int>? TagIds { get; set; } = new();
    }
}
