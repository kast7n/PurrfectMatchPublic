namespace PurrfectMatch.Shared.DTOs.Shelters
{
    public class ShelterApplicationFilterDto
    {
        public bool? IsApproved { get; set; } // Filter by approval status
        public DateTime? CreatedAfter { get; set; } // Filter by applications created after this date
        public DateTime? CreatedBefore { get; set; } // Filter by applications created before this date
        public int PageNumber { get; set; } = 1; // Pagination: Page number
        public int PageSize { get; set; } = 10; // Pagination: Page size
        public string? SortBy { get; set; } // Sorting: Field to sort by
        public bool SortDescending { get; set; } = false; // Sorting: Descending order
    }
}