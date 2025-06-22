using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PurrfectMatch.Shared.DTOs.Pets.Attributes.Breeds
{
    public class BreedDto
    {
        public int BreedId { get; set; }

        public int SpeciesId { get; set; }

        public string Name { get; set; } = null!;
    }
}
