using AutoMapper;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Shared.DTOs.Users;

namespace PurrfectMatch.Shared.MappingProfiles
{
    public class FavoriteProfile : Profile
    {
        public FavoriteProfile()
        {
            CreateMap<Favorite, FavoriteDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.FavoriteId))
                .ForMember(dest => dest.userId, opt => opt.MapFrom(src => src.UserId))
                .ForMember(dest => dest.PetId, opt => opt.MapFrom(src => src.PetId))
                .ForMember(dest => dest.AddedAt, opt => opt.MapFrom(src => src.CreatedAt));

            CreateMap<FavoriteDto, Favorite>()
                .ForMember(dest => dest.FavoriteId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.userId))
                .ForMember(dest => dest.PetId, opt => opt.MapFrom(src => src.PetId))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.AddedAt));

            CreateMap<AddToFavoritesDto, Favorite>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.userId))
                .ForMember(dest => dest.PetId, opt => opt.MapFrom(src => src.PetId))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.FavoriteId, opt => opt.Ignore())
                .ForMember(dest => dest.Pet, opt => opt.Ignore())
                .ForMember(dest => dest.User, opt => opt.Ignore());
        }
    }
}
