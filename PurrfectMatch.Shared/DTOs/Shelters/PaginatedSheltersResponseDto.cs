namespace PurrfectMatch.Shared.DTOs.Shelters
{
    public class PaginatedSheltersResponseDto
    {
        public IEnumerable<ShelterDto> Items { get; set; } = new List<ShelterDto>();
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }
}
