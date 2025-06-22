namespace PurrfectMatch.Shared.DTOs.AdoptionApplications
{
    public class PaginatedAdoptionApplicationsResponseDto
    {
        public IEnumerable<AdoptionApplicationDto> Items { get; set; } = new List<AdoptionApplicationDto>();
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }
}