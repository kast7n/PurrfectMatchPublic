using AutoMapper;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Shared.DTOs.Donations;

namespace PurrfectMatch.Shared.MappingProfiles
{
    public class DonationProfile : Profile
    {
        public DonationProfile()
        {
            // Map from Donation entity to DonationDto
            CreateMap<Donation, DonationDto>()
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description ?? string.Empty))
                .ForMember(dest => dest.PaymentStatus, opt => opt.MapFrom(src => src.PaymentStatus ?? "pending"));

            // Map from CreateDonationDto to Donation entity
            CreateMap<CreateDonationDto, Donation>()
                .ForMember(dest => dest.DonationId, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.User, opt => opt.Ignore())
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description ?? string.Empty))
                .ForMember(dest => dest.PaymentStatus, opt => opt.MapFrom(src => src.PaymentStatus ?? "pending"));

            // Map from DonationDto to Donation entity (for updates)
            CreateMap<DonationDto, Donation>()
                .ForMember(dest => dest.User, opt => opt.Ignore())
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description ?? string.Empty))
                .ForMember(dest => dest.PaymentStatus, opt => opt.MapFrom(src => src.PaymentStatus ?? "pending"));
        }
    }
}
