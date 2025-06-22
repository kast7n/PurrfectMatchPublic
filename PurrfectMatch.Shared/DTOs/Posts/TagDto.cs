namespace PurrfectMatch.Shared.DTOs.Posts
{
    public class TagDto
    {
        public int TagId { get; set; }
        
        public string TagName { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; }
    }
}
