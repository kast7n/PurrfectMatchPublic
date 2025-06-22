namespace PurrfectMatch.Shared.DTOs.Users
{
    public class UserFilterDto
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 25;
        public string? SortBy { get; set; } = "Email";
        public bool SortDescending { get; set; } = false;
        public string? Email { get; set; }
        public string? UserName { get; set; }
        public string? Role { get; set; }
        public int? ShelterId { get; set; } // For filtering by shelter
        public bool? EmailConfirmed { get; set; }
        public bool? IsLockedOut { get; set; }
    }
}
