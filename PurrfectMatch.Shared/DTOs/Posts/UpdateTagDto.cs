using System.ComponentModel.DataAnnotations;

namespace PurrfectMatch.Shared.DTOs.Posts
{
    public class UpdateTagDto
    {
        [StringLength(50, ErrorMessage = "Tag name cannot exceed 50 characters")]
        public string? TagName { get; set; }
    }
}
