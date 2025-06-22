namespace PurrfectMatch.Shared.DTOs.Posts
{
    public class PaginatedPostsResponseDto
    {
        public IEnumerable<PostDto> Items { get; set; } = new List<PostDto>();
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }
}
