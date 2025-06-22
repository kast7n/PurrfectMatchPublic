using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PurrfectMatch.Shared.DTOs.Shelters
{
    public class ShelterMetricsDto
    {
        public int ShelterId { get; set; }
        public string? ShelterName { get; set; }
        public int TotalPets { get; set; }
        public int AvailablePets { get; set; }
        public int AdoptedPets { get; set; }
        public int FollowerCount { get; set; }
        public decimal AverageRating { get; set; }
        public int ReviewCount { get; set; }
        
    }
}
