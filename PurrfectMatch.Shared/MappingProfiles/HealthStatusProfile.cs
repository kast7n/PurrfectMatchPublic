using AutoMapper;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Shared.DTOs.Pets.Attributes.HealthStatuses;

namespace PurrfectMatch.Shared.MappingProfiles
{
    public class HealthStatusProfile : Profile
    {
        public HealthStatusProfile()
        {
            CreateMap<HealthStatusDto, HealthStatus>();
            CreateMap<HealthStatus, HealthStatusDto>();
        }
    }
}

