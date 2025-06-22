using System.ComponentModel.DataAnnotations;

namespace PurrfectMatch.Shared.DTOs.Users
{
    public class UserDto
    {
        public string Id { get; set; } = null!;
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public bool EmailConfirmed { get; set; }
        public string? PhoneNumber { get; set; }
        public bool PhoneNumberConfirmed { get; set; }
        public bool TwoFactorEnabled { get; set; }
        public DateTimeOffset? LockoutEnd { get; set; }
        public bool LockoutEnabled { get; set; }
        public int AccessFailedCount { get; set; }
        public List<string> Roles { get; set; } = new();
        public DateTime CreatedAt { get; set; }
        public string? ShelterName { get; set; } // For shelter managers
        public int? ShelterId { get; set; } // For shelter managers
    }
}
