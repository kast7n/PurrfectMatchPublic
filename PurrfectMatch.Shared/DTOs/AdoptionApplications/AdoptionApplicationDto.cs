using System;

namespace PurrfectMatch.Shared.DTOs.AdoptionApplications;

public class AdoptionApplicationDto
    {
        public int Id { get; set; }
        public string? UserId { get; set; }
        public int PetId { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }