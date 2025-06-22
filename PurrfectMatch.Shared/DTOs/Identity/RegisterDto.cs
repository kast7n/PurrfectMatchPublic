using System.ComponentModel.DataAnnotations;


namespace PurrfectMatch.Shared.DTOs.Identity
{
    public class RegisterDto
    {
        [Required]
        public string Email { get; set; } = string.Empty;
        public required string Password { get; set; }
    }
}
