using System.ComponentModel.DataAnnotations;

namespace PurrfectMatch.Shared.DTOs.Posts
{
    public class UpdatePostDto
    {
        [StringLength(50, ErrorMessage = "Post type cannot exceed 50 characters")]
        public string? PostType { get; set; }
        
        [StringLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
        public string? Title { get; set; }
        
        [StringLength(5000, ErrorMessage = "Content cannot exceed 5000 characters")]
        public string? Content { get; set; }
        
        public List<int>? TagIds { get; set; }
    }
}
