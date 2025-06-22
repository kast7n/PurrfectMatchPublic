namespace PurrfectMatch.Shared.DTOs.Favorites
{
    public class FavoriteFilterDto
    {
        public string? UserId { get; set; }
        public int? PetId { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? SortBy { get; set; }
        public bool SortDescending { get; set; } = false;
    }
}