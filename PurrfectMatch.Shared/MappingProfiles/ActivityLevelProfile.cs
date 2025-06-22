using AutoMapper;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Shared.DTOs.Pets.Attributes.ActivityLevels;

namespace PurrfectMatch.Shared.MappingProfiles
{
    public class ActivityLevelProfile : Profile
    {
        public ActivityLevelProfile()
        {
            CreateMap<ActivityLevelDto, ActivityLevel>();
            CreateMap<ActivityLevel, ActivityLevelDto>();
        }
    }
}

