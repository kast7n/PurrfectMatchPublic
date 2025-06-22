using AutoMapper;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Shared.DTOs.Pets;

namespace PurrfectMatch.Shared.MappingProfiles
{
    public class PetProfile : Profile
    {
        public PetProfile()
        {
            CreateMap<Pet, Pet>();

            CreateMap<CreatePetDto, Pet>()
                .ForMember(dest => dest.ActivityLevel, opt => opt.Ignore())
                .ForMember(dest => dest.Breed, opt => opt.Ignore())
                .ForMember(dest => dest.Species, opt => opt.Ignore())
                .ForMember(dest => dest.HealthStatus, opt => opt.Ignore())
                .ForMember(dest => dest.Color, opt => opt.Ignore())
                .ForMember(dest => dest.CoatLength, opt => opt.Ignore())
                .ForMember(dest => dest.SpeciesId, opt => opt.MapFrom(src => src.SpeciesId))
                .ForMember(dest => dest.BreedId, opt => opt.MapFrom(src => src.BreedId))
                .ForMember(dest => dest.CoatLengthId, opt => opt.MapFrom(src => src.CoatLengthId))
                .ForMember(dest => dest.ColorId, opt => opt.MapFrom(src => src.ColorId))
                .ForMember(dest => dest.ActivityLevelId, opt => opt.MapFrom(src => src.ActivityLevelId))
                .ForMember(dest => dest.HealthStatusId, opt => opt.MapFrom(src => src.HealthStatusId));

            CreateMap<UpdatePetDto, Pet>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));            CreateMap<Pet, PetDto>()
                .ForMember(dest => dest.ShelterId, opt => opt.MapFrom(src => src.ShelterId))
                .ForMember(dest => dest.ShelterName, opt => opt.MapFrom(src => src.Shelter.Name ?? string.Empty))
                .ForMember(dest => dest.SpeciesName, opt => opt.MapFrom(src => src.Species.Name ?? string.Empty))
                .ForMember(dest => dest.BreedName, opt => opt.MapFrom(src => src.Breed != null ? src.Breed.Name : string.Empty))
                .ForMember(dest => dest.CoatLength, opt => opt.MapFrom(src => src.CoatLength != null ? src.CoatLength.Length : string.Empty))
                .ForMember(dest => dest.Color, opt => opt.MapFrom(src => src.Color != null ? src.Color.Color1 : string.Empty))
                .ForMember(dest => dest.ActivityLevel, opt => opt.MapFrom(src => src.ActivityLevel != null ? src.ActivityLevel.Activity : string.Empty))
                .ForMember(dest => dest.HealthStatus, opt => opt.MapFrom(src => src.HealthStatus != null ? src.HealthStatus.Status : string.Empty))
                .ForMember(dest => dest.PhotoUrls, opt => opt.MapFrom(src => src.PetPhotos.Select(photo => photo.PhotoUrl)));
        }
    }
}

