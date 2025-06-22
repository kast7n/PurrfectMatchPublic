// PurrfectMatch.Shared/DTOs/Users/FavoriteDto.cs
namespace PurrfectMatch.Shared.DTOs.Users
{
    public class FavoriteDto
    {
        public int Id { get; set; }
        public string? userId { get; set; }
        public int PetId { get; set; }
        public System.DateTime AddedAt { get; set; }
    }
}