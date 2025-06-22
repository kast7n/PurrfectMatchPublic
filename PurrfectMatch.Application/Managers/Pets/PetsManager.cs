using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using PurrfectMatch.Application.Specifications.PetSpecifications;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Domain.Interfaces.IRepositories;
using PurrfectMatch.Domain.Interfaces.Services;
using PurrfectMatch.Shared.DTOs.Pets;
using PurrfectMatch.Application.Specifications.Pets;
using PurrfectMatch.Application.Managers.Pets.Attributes; // Added for attribute managers
using PurrfectMatch.Shared.DTOs.Pets.Attributes.Species; // Added for Species DTOs
using PurrfectMatch.Shared.DTOs.Pets.Attributes.Breeds; // Added for Breed DTOs
using PurrfectMatch.Shared.DTOs.Pets.Attributes.ActivityLevels; // Added for ActivityLevel DTOs
using PurrfectMatch.Shared.DTOs.Pets.Attributes.HealthStatuses; // Added for HealthStatus DTOs
using PurrfectMatch.Shared.DTOs.Pets.Attributes.Colors; // Added for Color DTOs
using PurrfectMatch.Shared.DTOs.Pets.Attributes.CoatLength; // Added for CoatLength DTOs

namespace PurrfectMatch.Application.Managers.Pets
{
    public class PetsManager
    {
        private readonly IBaseRepository<Pet> _petRepository;
        private readonly IBaseRepository<PetPhoto> _petPhotoRepository;
        private readonly IHealthRecordRepository _healthRecordRepository;
        private readonly IBlobStorageService _blobStorageService;
        private readonly IBaseSoftDeleteRepository<Pet> _softDeleteRepository;
        private readonly IMapper _mapper;
        private readonly SpeciesManager _speciesManager;
        private readonly BreedsManager _breedsManager;
        private readonly ActivityLevelsManager _activityLevelsManager;
        private readonly HealthStatusesManager _healthStatusesManager;
        private readonly ColorsManager _colorsManager;
        private readonly CoatLengthsManager _coatLengthsManager;

        public PetsManager(
            IBaseRepository<Pet> petRepository,
            IBaseRepository<PetPhoto> petPhotoRepository,
            IHealthRecordRepository healthRecordRepository,
            IBlobStorageService blobStorageService,
            IBaseSoftDeleteRepository<Pet> softDeleteRepository,
            IMapper mapper,
            SpeciesManager speciesManager,
            BreedsManager breedsManager,
            ActivityLevelsManager activityLevelsManager,
            HealthStatusesManager healthStatusesManager,
            ColorsManager colorsManager,
            CoatLengthsManager coatLengthsManager)
        {
            _petRepository = petRepository;
            _petPhotoRepository = petPhotoRepository;
            _healthRecordRepository = healthRecordRepository;
            _blobStorageService = blobStorageService;
            _softDeleteRepository = softDeleteRepository;
            _mapper = mapper;
            _speciesManager = speciesManager;
            _breedsManager = breedsManager;
            _activityLevelsManager = activityLevelsManager;
            _healthStatusesManager = healthStatusesManager;
            _colorsManager = colorsManager;
            _coatLengthsManager = coatLengthsManager;
        }

        private async Task ResolvePetAttributesAsync(CreatePetDto petDto)
        {
            // Handle Species
            if (!petDto.SpeciesId.HasValue && !string.IsNullOrEmpty(petDto.Species))
            {
                var existingSpecies = (await _speciesManager.GetSpeciesAsync(new SpeciesFilterDto { Name = petDto.Species })).FirstOrDefault();
                if (existingSpecies != null)
                {
                    petDto.SpeciesId = existingSpecies.SpeciesId;
                }
                else
                {
                    var species = await _speciesManager.CreateSpeciesAsync(new SpeciesDto { Name = petDto.Species });
                    petDto.SpeciesId = species.SpeciesId;
                }
            }

            // Handle Breed
            if (!petDto.BreedId.HasValue && !string.IsNullOrEmpty(petDto.Breed) && petDto.SpeciesId.HasValue) // Breed resolution depends on SpeciesId
            {
                var existingBreed = (await _breedsManager.GetBreedsAsync(new BreedFilterDto { Name = petDto.Breed, SpeciesId = petDto.SpeciesId })).FirstOrDefault();
                if (existingBreed != null)
                {
                    petDto.BreedId = existingBreed.BreedId;
                }
                else
                {
                    var breed = await _breedsManager.CreateBreedAsync(new BreedDto { Name = petDto.Breed, SpeciesId = petDto.SpeciesId.Value });
                    petDto.BreedId = breed.BreedId;
                }
            }

            // Handle Activity Level
            if (!petDto.ActivityLevelId.HasValue && !string.IsNullOrEmpty(petDto.ActivityLevel))
            {
                var existingActivityLevel = (await _activityLevelsManager.GetActivityLevelsAsync(new ActivityLevelFilterDto { Activity = petDto.ActivityLevel })).FirstOrDefault();
                if (existingActivityLevel != null)
                {
                    petDto.ActivityLevelId = existingActivityLevel.ActivityLevelId;
                }
                else
                {
                    var activityLevel = await _activityLevelsManager.CreateActivityLevelAsync(new ActivityLevelDto { Activity = petDto.ActivityLevel });
                    petDto.ActivityLevelId = activityLevel.ActivityLevelId;
                }
            }

            // Handle Health Status
            if (!petDto.HealthStatusId.HasValue && !string.IsNullOrEmpty(petDto.HealthStatus))
            {
                var existingHealthStatus = (await _healthStatusesManager.GetHealthStatusesAsync(new HealthStatusFilterDto { Status = petDto.HealthStatus })).FirstOrDefault();
                if (existingHealthStatus != null)
                {
                    petDto.HealthStatusId = existingHealthStatus.HealthStatusId;
                }
                else
                {
                    var healthStatus = await _healthStatusesManager.CreateHealthStatusAsync(new HealthStatusDto { Status = petDto.HealthStatus });
                    petDto.HealthStatusId = healthStatus.HealthStatusId;
                }
            }

            // Handle Color
            if (!petDto.ColorId.HasValue && !string.IsNullOrEmpty(petDto.Color))
            {
                var existingColor = (await _colorsManager.GetColorsAsync(new ColorFilterDto { Color1 = petDto.Color })).FirstOrDefault();
                if (existingColor != null)
                {
                    petDto.ColorId = existingColor.ColorId;
                }
                else
                {
                    var color = await _colorsManager.CreateColorAsync(new ColorDto { Color1 = petDto.Color });
                    petDto.ColorId = color.ColorId;
                }
            }

            // Handle Coat Length
            if (!petDto.CoatLengthId.HasValue && !string.IsNullOrEmpty(petDto.CoatLength))
            {
                var existingCoatLength = (await _coatLengthsManager.GetCoatLengthsAsync(new CoatLengthFilterDto { Length = petDto.CoatLength })).FirstOrDefault();
                if (existingCoatLength != null)
                {
                    petDto.CoatLengthId = existingCoatLength.CoatLengthId;
                }
                else
                {
                    var coatLength = await _coatLengthsManager.CreateCoatLengthAsync(new CoatLengthDto { Length = petDto.CoatLength });
                    petDto.CoatLengthId = coatLength.CoatLengthId;
                }
            }
        }

        public async Task<int> AddPetAsync(CreatePetDto petDto)
        {
            await ResolvePetAttributesAsync(petDto); // Resolve attributes, petDto is modified by reference
            var pet = _mapper.Map<Pet>(petDto); // Now map the updated petDto
            await _petRepository.CreateAsync(pet);
            await _petRepository.SaveChangesAsync();
            return pet.PetId;
        }

        public async Task<Pet?> GetPetByIdAsync(int id)
        {
            return await _petRepository.GetAsync(id);
        }

        public async Task<IReadOnlyList<Pet>> GetFilteredPetsAsync(PetFilterDto filter)
        {
            var spec = new PetsFilterSpecification(filter);
            return await _petRepository.ListAsync(spec);
        }        public async Task<PaginatedPetsResponseDto> GetFilteredPetsPaginatedAsync(PetFilterDto filter)
        {
            var spec = new PetsFilterSpecification(filter);
            
            // Get the pets for the current page
            var pets = await _petRepository.ListAsync(spec);
            
            // Get the total count using the same filter but without pagination
            // Create a copy of the filter with pagination disabled for counting
            var countFilter = new PetFilterDto
            {
                Name = filter.Name,
                SpeciesId = filter.SpeciesId,
                BreedId = filter.BreedId,
                Size = filter.Size,
                Age = filter.Age,
                Gender = filter.Gender,
                CoatLengthId = filter.CoatLengthId,
                ColorId = filter.ColorId,
                ActivityLevelId = filter.ActivityLevelId,
                HealthStatusId = filter.HealthStatusId,
                Microchipped = filter.Microchipped,
                IsAdopted = filter.IsAdopted,
                IsDeleted = filter.IsDeleted,
                ShelterId = filter.ShelterId,
                ShelterName = filter.ShelterName,
                City = filter.City,
                RadiusKm = filter.RadiusKm,
                GoodWith = filter.GoodWith,
                SortBy = filter.SortBy,
                SortDescending = filter.SortDescending,
                PageNumber = 1,
                PageSize = int.MaxValue // This will effectively disable pagination for counting
            };
            var countSpec = new PetsFilterSpecification(countFilter);
            var totalCount = await _petRepository.CountAsync(countSpec);
            
            // Map pets to DTOs
            var petDtos = pets.Select(pet => 
            {
                var petDto = _mapper.Map<PetDto>(pet);
                // Include photo URLs if pets have photos loaded
                if (pet.PetPhotos != null && pet.PetPhotos.Any())
                {
                    petDto.PhotoUrls = pet.PetPhotos.Select(p => p.PhotoUrl).ToList();
                }
                return petDto;
            }).ToList();

            // Calculate total pages
            var totalPages = filter.PageSize > 0 ? (int)Math.Ceiling((double)totalCount / filter.PageSize) : 1;

            return new PaginatedPetsResponseDto
            {
                Items = petDtos,
                TotalCount = totalCount,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize,
                TotalPages = totalPages
            };
        }

        public async Task<Pet?> UpdatePetAsync(int id, UpdatePetDto updatePetDto)
        {
            var pet = await _petRepository.GetAsync(id);
            if (pet == null) return null;
            _mapper.Map(updatePetDto, pet);
            _petRepository.Update(pet);
            await _petRepository.SaveChangesAsync();
            return pet;
        }

        public async Task<bool> SoftDeletePetAsync(int id)
        {
            var pet = await _softDeleteRepository.GetAsync(id);
            if (pet == null) return false;
            _softDeleteRepository.Delete(pet);
            await _softDeleteRepository.SaveChangesAsync();
            return true;
        }

        public async Task<PetDto> GetPetDetailsAsync(int petId)
        {
            var pet = await _petRepository.GetAsync(petId);
            if (pet == null)
                throw new KeyNotFoundException("Pet not found.");
            var petDto = _mapper.Map<PetDto>(pet);
            var photoSpecification = new PhotosByPetIdSpecification(petId);
            var photos = await _petPhotoRepository.ListAsync(photoSpecification);
            petDto.PhotoUrls = photos.Select(p => p.PhotoUrl).ToList();
            return petDto;
        }

        public async Task<string> UploadPetImageAsync(int petId, IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File is empty");
            using var stream = file.OpenReadStream();
            var fileName = $"{petId}_{Path.GetFileNameWithoutExtension(file.FileName)}_{DateTime.UtcNow:yyyyMMddTHHmmss}{Path.GetExtension(file.FileName)}";
            var url = await _blobStorageService.UploadImageAsync(fileName, stream);
            var petPhoto = new PetPhoto
            {
                PetId = petId,
                PhotoUrl = url,
                CreatedAt = DateTime.UtcNow
            };
            await _petPhotoRepository.CreateAsync(petPhoto);
            await _petPhotoRepository.SaveChangesAsync();
            return url;
        }

        public async Task<Stream> GetPetImageAsync(int petId, int photoId)
        {
            var petPhoto = await _petPhotoRepository.GetAsync(photoId);
            if (petPhoto == null || petPhoto.PetId != petId)
                throw new KeyNotFoundException("Photo not found or does not belong to the specified pet.");
            return await _blobStorageService.GetImageAsync(petPhoto.PhotoUrl);
        }

        public async Task DeletePetImageAsync(int petId, int photoId)
        {
            var petPhoto = await _petPhotoRepository.GetAsync(photoId);
            if (petPhoto == null || petPhoto.PetId != petId)
                throw new KeyNotFoundException("Photo not found or does not belong to the specified pet.");
            await _blobStorageService.DeleteImageAsync(petPhoto.PhotoUrl);
            _petPhotoRepository.Delete(petPhoto);
            await _petPhotoRepository.SaveChangesAsync();
        }

        public async Task<IEnumerable<int>> BatchCreatePetsAsync(
            IEnumerable<CreatePetDto> petDtos)
            // Removed attribute manager parameters as they are now fields
        {
            var createdPetIds = new List<int>();
            foreach (var petDto in petDtos)
            {
                // The attribute resolution is now handled by AddPetAsync
                var petId = await AddPetAsync(petDto);
                createdPetIds.Add(petId);
            }
            return createdPetIds;
        }
    }
}
