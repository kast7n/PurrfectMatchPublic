using AutoMapper;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Shared.DTOs.Pets.Attributes.Colors;

namespace PurrfectMatch.Shared.MappingProfiles
{
    public class ColorProfile : Profile
    {
        public ColorProfile()
        {
            CreateMap<ColorDto, Color>();
            CreateMap<Color, ColorDto>();
        }
    }
}

