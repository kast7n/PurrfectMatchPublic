namespace PurrfectMatch.Shared.DTOs.Pets
{
    public class PaginatedPetsResponseDto
    {
        public IEnumerable<PetDto> Items { get; set; } = new List<PetDto>();
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }
}
