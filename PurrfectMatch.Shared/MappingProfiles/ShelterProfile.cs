using AutoMapper;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Shared.DTOs.Shelters;
using AddressDto = PurrfectMatch.Shared.DTOs.Addresses.AddressDto;
using System;

namespace PurrfectMatch.Shared.MappingProfiles
{
    public class ShelterProfile : Profile
    {
        public ShelterProfile()
        {
            CreateMap<Shelter, Shelter>();

            // Add mapping for Shelters.AddressDto to Address entity
            CreateMap<PurrfectMatch.Shared.DTOs.Shelters.AddressDto, Address>()
                .ForMember(dest => dest.AddressId, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.Shelters, opt => opt.Ignore())
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<CreateShelterDto, Shelter>()
                .ForMember(dest => dest.Address, opt => opt.Ignore())
                .ForMember(dest => dest.Pets, opt => opt.Ignore())
                .ForMember(dest => dest.ShelterManagers, opt => opt.Ignore());

            CreateMap<UpdateShelterDto, Shelter>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));            CreateMap<Shelter, ShelterDto>()
                .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.Address != null ? new PurrfectMatch.Shared.DTOs.Shelters.AddressDto
                {
                    Street = src.Address.Street,
                    City = src.Address.City ?? string.Empty,
                    State = src.Address.State ?? string.Empty,
                    PostalCode = src.Address.PostalCode,
                    Country = src.Address.Country
                } : null));CreateMap<Shelter, ShelterMetricsDto>()
                .ForMember(dest => dest.ShelterId, opt => opt.MapFrom(src => src.ShelterId))
                .ForMember(dest => dest.ShelterName, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.TotalPets, opt => opt.Ignore())
                .ForMember(dest => dest.AvailablePets, opt => opt.Ignore())
                .ForMember(dest => dest.AdoptedPets, opt => opt.Ignore())
                .ForMember(dest => dest.FollowerCount, opt => opt.Ignore())
                .ForMember(dest => dest.AverageRating, opt => opt.Ignore())
                .ForMember(dest => dest.ReviewCount, opt => opt.Ignore());            // Shelter Application mappings
            CreateMap<CreateShelterApplicationDto, ShelterCreationRequest>()
                .ForMember(dest => dest.RequestId, opt => opt.Ignore())
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))
                .ForMember(dest => dest.ShelterName, opt => opt.MapFrom(src => src.ShelterName))
                .ForMember(dest => dest.RequestedAddress, opt => opt.Ignore()) // Will be handled separately in manager
                .ForMember(dest => dest.AddressId, opt => opt.Ignore()) // Will be set in manager after address processing
                .ForMember(dest => dest.RequestDate, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => "Pending"))
                .ForMember(dest => dest.Remarks, opt => opt.MapFrom(src => src.Remarks))
                .ForMember(dest => dest.IsApproved, opt => opt.MapFrom(src => (bool?)null))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.User, opt => opt.Ignore()) // Navigation property
                .ForMember(dest => dest.Address, opt => opt.Ignore()); // Navigation property

            CreateMap<ShelterCreationRequest, ShelterCreationRequestDto>()
                .ForMember(dest => dest.RequestId, opt => opt.MapFrom(src => src.RequestId))
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))
                .ForMember(dest => dest.ShelterName, opt => opt.MapFrom(src => src.ShelterName))
                .ForMember(dest => dest.RequestedAddress, opt => opt.MapFrom(src => src.RequestedAddress))
                .ForMember(dest => dest.RequestDate, opt => opt.MapFrom(src => src.RequestDate))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
                .ForMember(dest => dest.Remarks, opt => opt.MapFrom(src => src.Remarks))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.UpdatedAt));
        }
    }
}
