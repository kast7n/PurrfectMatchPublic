using System;
using PurrfectMatch.Shared.DTOs.Shelters;

namespace PurrfectMatch.Shared.DTOs.Shelters;

    public class UpdateShelterDto
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public string? Website { get; set; }
        public AddressDto? Address { get; set; }
    }
