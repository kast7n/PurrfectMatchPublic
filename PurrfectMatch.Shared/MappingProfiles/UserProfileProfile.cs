using AutoMapper;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Shared.DTOs.Users;

namespace PurrfectMatch.Shared.MappingProfiles
{
    public class UserProfileProfile : Profile
    {
        public UserProfileProfile()
        {
            // Map from UserProfileDto to UserProfile entity for creating/updating
            CreateMap<UserProfileDto, UserProfile>()
                .ForMember(dest => dest.UserProfileId, opt => opt.Ignore())
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.userId))
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.PhoneNumber))
                .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => src.PhotoUrl))
                .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.Age))
                .ForMember(dest => dest.Job, opt => opt.MapFrom(src => src.Job))
                .ForMember(dest => dest.CurrentPetsOwned, opt => opt.MapFrom(src => src.CurrentPetsOwned))                .ForMember(dest => dest.GeneralInfo, opt => opt.MapFrom(src => src.GeneralInfo ?? string.Empty))
                .ForMember(dest => dest.HousingType, opt => opt.MapFrom(src => src.HousingType ?? string.Empty))
                .ForMember(dest => dest.HasYard, opt => opt.MapFrom(src => src.HasYard))
                .ForMember(dest => dest.Allergies, opt => opt.MapFrom(src => src.Allergies))
                .ForMember(dest => dest.ExperienceWithPets, opt => opt.MapFrom(src => src.ExperienceWithPets ?? string.Empty))
                // Convert Address object to Location string
                .ForMember(dest => dest.Location, opt => opt.MapFrom(src => 
                    src.Address != null 
                        ? $"{src.Address.Street}, {src.Address.City}, {src.Address.State} {src.Address.PostalCode}, {src.Address.Country}".Trim(' ', ',')
                        : null))                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.User, opt => opt.Ignore());

            // Map from UserProfile entity to UserProfileDto for returning data
            CreateMap<UserProfile, UserProfileDto>()
                .ForMember(dest => dest.userId, opt => opt.MapFrom(src => src.UserId))
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.PhoneNumber))
                .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => src.PhotoUrl))
                .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.Age))
                .ForMember(dest => dest.Job, opt => opt.MapFrom(src => src.Job))
                .ForMember(dest => dest.CurrentPetsOwned, opt => opt.MapFrom(src => src.CurrentPetsOwned ?? 0))
                .ForMember(dest => dest.GeneralInfo, opt => opt.MapFrom(src => src.GeneralInfo ?? string.Empty))
                .ForMember(dest => dest.HousingType, opt => opt.MapFrom(src => src.HousingType ?? string.Empty))
                .ForMember(dest => dest.HasYard, opt => opt.MapFrom(src => src.HasYard ?? false))
                .ForMember(dest => dest.Allergies, opt => opt.MapFrom(src => src.Allergies))
                .ForMember(dest => dest.ExperienceWithPets, opt => opt.MapFrom(src => src.ExperienceWithPets ?? string.Empty))
                // Convert Location string back to Address object (simplified - you may want to parse the string)
                .ForMember(dest => dest.Address, opt => opt.MapFrom(src => 
                    !string.IsNullOrEmpty(src.Location) 
                        ? new UserAddressDto { Street = src.Location } // Store full location in Street for now
                        : null))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.UpdatedAt));
        }
    }
}
