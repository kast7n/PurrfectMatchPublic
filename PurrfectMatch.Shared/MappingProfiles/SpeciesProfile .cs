using AutoMapper;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Shared.DTOs.Pets.Attributes.Species;

namespace PurrfectMatch.Shared.MappingProfiles
{
    public class SpeciesProfile : Profile
    {
        public SpeciesProfile()
        {
            CreateMap<SpeciesDto, Species>();
            CreateMap<Species, SpeciesDto>();
        }
    }
}


