namespace PurrfectMatch.Shared.DTOs.Shelters
{
    public class PaginatedShelterApplicationsResponseDto
    {
        public IEnumerable<ShelterCreationRequestDto> Items { get; set; } = new List<ShelterCreationRequestDto>();
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public bool HasPreviousPage => PageNumber > 1;
        public bool HasNextPage => PageNumber < TotalPages;
    }
}
