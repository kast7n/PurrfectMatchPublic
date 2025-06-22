using AutoMapper;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Shared.DTOs.Pets.Attributes.CoatLength;

namespace PurrfectMatch.Shared.MappingProfiles
{
    public class CoatLengthProfile : Profile
    {
        public CoatLengthProfile()
        {
            CreateMap<CoatLengthDto, CoatLength>();
            CreateMap<CoatLength, CoatLengthDto>();
        }
    }
}

