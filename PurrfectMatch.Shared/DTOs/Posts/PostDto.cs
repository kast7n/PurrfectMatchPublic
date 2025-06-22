namespace PurrfectMatch.Shared.DTOs.Posts
{
    public class PostDto
    {
        public int PostId { get; set; }
        
        public string PostType { get; set; } = string.Empty;
        
        public int? ShelterId { get; set; }
        
        public string ShelterName { get; set; } = string.Empty;
        
        public string UserId { get; set; } = string.Empty;
        
        public string UserName { get; set; } = string.Empty;
        
        public string Title { get; set; } = string.Empty;
        
        public string Content { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; }
        
        public DateTime UpdatedAt { get; set; }
        
        public List<TagDto> Tags { get; set; } = new();
    }
}
