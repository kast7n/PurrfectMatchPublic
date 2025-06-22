using System;

namespace PurrfectMatch.Shared.DTOs.AdoptionApplications;

public class CreateAdoptionApplicationDto
{
    public string UserId { get; set; } = string.Empty;
    public int PetId { get; set; }
}
