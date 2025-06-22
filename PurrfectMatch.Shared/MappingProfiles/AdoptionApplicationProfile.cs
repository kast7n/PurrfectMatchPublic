using AutoMapper;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Shared.DTOs.AdoptionApplications;

namespace PurrfectMatch.Shared.MappingProfiles
{
    public class AdoptionApplicationProfile : Profile
    {
        public AdoptionApplicationProfile()
        {
            CreateMap<AdoptionApplication, AdoptionApplicationDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.ApplicationId))
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))
                .ForMember(dest => dest.PetId, opt => opt.MapFrom(src => src.PetId))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt));            CreateMap<CreateAdoptionApplicationDto, AdoptionApplication>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))
                .ForMember(dest => dest.PetId, opt => opt.MapFrom(src => src.PetId))
                .ForMember(dest => dest.ApplicationDate, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => "Pending"))
                .ForMember(dest => dest.IsDeleted, opt => opt.MapFrom(src => false))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.ApplicationId, opt => opt.Ignore())
                .ForMember(dest => dest.DeletedAt, opt => opt.Ignore())
                .ForMember(dest => dest.DeletedByUserId, opt => opt.Ignore())
                .ForMember(dest => dest.ApplicationNotifications, opt => opt.Ignore())
                .ForMember(dest => dest.DeletedByUser, opt => opt.Ignore())
                .ForMember(dest => dest.Pet, opt => opt.Ignore())
                .ForMember(dest => dest.User, opt => opt.Ignore());
        }
    }
}
