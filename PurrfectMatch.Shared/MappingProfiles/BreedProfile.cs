using AutoMapper;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Shared.DTOs.Pets.Attributes.Breeds;

namespace PurrfectMatch.Shared.MappingProfiles
{
    public class BreedProfile : Profile
    {
        public BreedProfile()
        {
            CreateMap<BreedDto, Breed>();
            CreateMap<Breed, BreedDto>();
        }
    }
}


