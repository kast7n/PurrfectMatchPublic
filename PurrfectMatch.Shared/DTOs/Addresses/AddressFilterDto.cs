namespace PurrfectMatch.Shared.DTOs.Addresses
{
    public class AddressFilterDto
    {
        public string? City { get; set; }
        public string? State { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? SortBy { get; set; }
        public bool SortDescending { get; set; } = false;
    }
}