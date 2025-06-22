using AutoMapper;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Shared.DTOs.Addresses;

namespace PurrfectMatch.Shared.MappingProfiles
{
    public class AddressProfile : Profile
    {        public AddressProfile()
        {
            // Map from AddressDto to Address entity for creating/updating
            CreateMap<AddressDto, Address>()
                .ForMember(dest => dest.AddressId, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.Shelters, opt => opt.Ignore());

            // Map from Address entity to AddressDto for returning data
            CreateMap<Address, AddressDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.AddressId))
                .ForMember(dest => dest.Street, opt => opt.MapFrom(src => src.Street ?? string.Empty))
                .ForMember(dest => dest.City, opt => opt.MapFrom(src => src.City ?? string.Empty))
                .ForMember(dest => dest.State, opt => opt.MapFrom(src => src.State ?? string.Empty))
                .ForMember(dest => dest.PostalCode, opt => opt.MapFrom(src => src.PostalCode ?? string.Empty))
                .ForMember(dest => dest.Country, opt => opt.MapFrom(src => src.Country ?? string.Empty))
                .ForMember(dest => dest.GoogleMapLink, opt => opt.MapFrom(src => src.GoogleMapLink ?? string.Empty));

            // Map for updating existing entities (ignores null values)
            CreateMap<AddressDto, Address>()
                .ForMember(dest => dest.AddressId, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.Shelters, opt => opt.Ignore())
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            // Self-mapping for Address entities
            CreateMap<Address, Address>();
        }
    }
}