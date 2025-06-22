using System.ComponentModel.DataAnnotations;

namespace PurrfectMatch.Shared.DTOs.Users
{
    public class AddToFavoritesDto
    {
        [Required]
        public string? userId { get; set; }

        [Required]
        public int PetId { get; set; }
    }
}