using System.ComponentModel.DataAnnotations;

namespace PurrfectMatch.Shared.DTOs.Identity
{
    public class ForgotPasswordDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
    }
}
