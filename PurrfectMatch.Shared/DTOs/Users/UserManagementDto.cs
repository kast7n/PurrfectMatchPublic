using System.ComponentModel.DataAnnotations;

namespace PurrfectMatch.Shared.DTOs.Users
{
    public class AssignShelterManagerDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;
        
        [Required]
        public int ShelterId { get; set; }
    }
    
    public class RemoveUserDto
    {
        [Required]
        public string UserId { get; set; } = null!;
    }

    public class RemoveShelterManagerDto
    {
        [Required]
        public string UserId { get; set; } = null!;
        
        [Required]
        public int ShelterId { get; set; }
    }

    public class UpdateUserRoleDto
    {
        [Required]
        public string UserId { get; set; } = null!;
        
        [Required]
        public string Role { get; set; } = null!;
    }

    public class UpdateUserShelterDto
    {
        [Required]
        public string UserId { get; set; } = null!;
        
        public int? NewShelterId { get; set; } // null to remove from shelter
        
        public int? OldShelterId { get; set; } // current shelter to remove from
    }

    public class UpdateUserDetailsDto
    {
        [Required]
        public string UserId { get; set; } = null!;
        
        public string? UserName { get; set; }
        
        [EmailAddress]
        public string? Email { get; set; }
        
        public string? PhoneNumber { get; set; }
        
        public bool? EmailConfirmed { get; set; }
        
        public bool? LockoutEnabled { get; set; }
        
        public DateTimeOffset? LockoutEnd { get; set; }
    }
}
