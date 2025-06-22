using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using PurrfectMatch.Application.Specifications.Favorites;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Domain.Interfaces.IRepositories;
using PurrfectMatch.Domain.Interfaces.Services;
using PurrfectMatch.Shared.DTOs.Favorites;
using PurrfectMatch.Shared.DTOs.Users;

namespace PurrfectMatch.Application.Managers;

public class UsersManager
{
    private readonly IBaseRepository<Favorite> _favoriteRepository;
    private readonly IBaseRepository<Pet> _petRepository;
    private readonly IMapper _mapper;
    private readonly IUserProfileRepository _userProfileRepository;
    private readonly IBlobStorageService _blobStorageService;

    public UsersManager(
        IBaseRepository<Favorite> favoriteRepository,
        IBaseRepository<Pet> petRepository,
        IUserProfileRepository userProfileRepository,
        IBlobStorageService blobStorageService,
        IMapper mapper)
    {
        _favoriteRepository = favoriteRepository;
        _petRepository = petRepository;
        _userProfileRepository = userProfileRepository;
        _blobStorageService = blobStorageService;
        _mapper = mapper;
    }

    public async Task<bool> AddToFavoritesAsync(AddToFavoritesDto addToFavoritesDto)
    {
        var petExists = await _petRepository.GetAsync(addToFavoritesDto.PetId) != null;
        if (!petExists) return false;
        var spec = new FavoritesFilterSpecification(new FavoriteFilterDto
        {
            UserId = addToFavoritesDto.userId,
            PetId = addToFavoritesDto.PetId
        });
        var existingFavorite = await _favoriteRepository.ListAsync(spec);
        if (existingFavorite != null && existingFavorite.Any()) return true;
        var favorite = _mapper.Map<Favorite>(addToFavoritesDto);
        favorite.CreatedAt = DateTime.UtcNow;
        await _favoriteRepository.CreateAsync(favorite);
        await _favoriteRepository.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteFromFavoritesAsync(string userId, int petId)
    {
        var spec = new FavoritesFilterSpecification(new FavoriteFilterDto
        {
            UserId = userId,
            PetId = petId
        });
        var favoriteToRemove = await _favoriteRepository.ListAsync(spec);
        if (favoriteToRemove == null || favoriteToRemove.Count == 0) return false;
        _favoriteRepository.Delete(favoriteToRemove[0]);
        await _favoriteRepository.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<FavoriteDto>> GetUserFavoritesAsync(string userId)
    {
        var spec = new FavoritesFilterSpecification(new FavoriteFilterDto { UserId = userId });
        var favorites = await _favoriteRepository.ListAsync(spec);
        return favorites.Select(f => _mapper.Map<FavoriteDto>(f));
    }

    public async Task<UserProfileDto?> CreateUserProfileAsync(UserProfileDto userProfileDto)
    {
        var userProfile = _mapper.Map<UserProfile>(userProfileDto);
        userProfile.CreatedAt = DateTime.UtcNow;
        userProfile.UpdatedAt = DateTime.UtcNow;
        await _userProfileRepository.CreateAsync(userProfile);
        await _userProfileRepository.SaveChangesAsync();
        return _mapper.Map<UserProfileDto>(userProfile);
    }

    public async Task<UserProfileDto?> GetUserProfileByIdAsync(string userId)
    {
        var userProfile = await _userProfileRepository.GetUserProfileByUserId(userId);
        return userProfile != null ? _mapper.Map<UserProfileDto>(userProfile) : null;
    }    public async Task<UserProfileDto?> UpdateUserProfileAsync(string userId, UserProfileDto userProfileDto)
    {
        var existingProfile = await _userProfileRepository.GetUserProfileByUserId(userId);
        if (existingProfile == null) return null;
        
        // Update all fields from the DTO
        if (userProfileDto.PhoneNumber != null)
            existingProfile.PhoneNumber = userProfileDto.PhoneNumber;
        if (userProfileDto.Age.HasValue)
            existingProfile.Age = userProfileDto.Age.Value;
        if (userProfileDto.Job != null)
            existingProfile.Job = userProfileDto.Job;
        if (userProfileDto.CurrentPetsOwned >= 0)
            existingProfile.CurrentPetsOwned = userProfileDto.CurrentPetsOwned;
        if (userProfileDto.GeneralInfo != null)
            existingProfile.GeneralInfo = userProfileDto.GeneralInfo;
        if (userProfileDto.HousingType != null)
            existingProfile.HousingType = userProfileDto.HousingType;
        existingProfile.HasYard = userProfileDto.HasYard;
        if (userProfileDto.Allergies != null)
            existingProfile.Allergies = userProfileDto.Allergies;
        if (userProfileDto.ExperienceWithPets != null)
            existingProfile.ExperienceWithPets = userProfileDto.ExperienceWithPets;
            
        // Handle Address to Location mapping
        if (userProfileDto.Address != null)
        {
            existingProfile.Location = $"{userProfileDto.Address.Street}, {userProfileDto.Address.City}, {userProfileDto.Address.State} {userProfileDto.Address.PostalCode}, {userProfileDto.Address.Country}".Trim(' ', ',');
        }
        
        existingProfile.UpdatedAt = DateTime.UtcNow;
        await _userProfileRepository.SaveChangesAsync();
        return _mapper.Map<UserProfileDto>(existingProfile);
    }    public async Task<bool> SoftDeleteUserProfileAsync(string userId)
    {
        var userProfile = await _userProfileRepository.GetUserProfileByUserId(userId);
        if (userProfile == null) return false;
        
        // Since we don't have soft delete columns, we'll do a hard delete
        _userProfileRepository.Delete(userProfile);
        await _userProfileRepository.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteUserProfileAsync(string userId)
    {
        var userProfile = await _userProfileRepository.GetUserProfileByUserId(userId);
        if (userProfile == null) return false;
        _userProfileRepository.Delete(userProfile);
        await _userProfileRepository.SaveChangesAsync();
        return true;
    }    public async Task<string> UploadUserPhotoAsync(string userId, IFormFile file)
    {
        if (file == null || file.Length == 0)
            throw new ArgumentException("File is empty");

        if (string.IsNullOrEmpty(userId))
            throw new ArgumentException("User ID is required");

        // Validate file type
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
        var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(fileExtension))
            throw new ArgumentException("Invalid file type. Only JPG, JPEG, PNG, GIF, and WEBP files are allowed.");

        // Validate file size (limit to 5MB)
        if (file.Length > 5 * 1024 * 1024)
            throw new ArgumentException("File size cannot exceed 5MB");

        // Get the user profile to ensure it exists
        var userProfile = await _userProfileRepository.GetUserProfileByUserId(userId);
        if (userProfile == null)
            throw new ArgumentException($"User profile not found for user ID: {userId}");

        try
        {
            using var stream = file.OpenReadStream();
            var fileName = $"user_{userId}_{DateTime.UtcNow:yyyyMMddTHHmmss}{Path.GetExtension(file.FileName)}";
            var url = await _blobStorageService.UploadImageAsync(fileName, stream);
            
            // Update the user profile with the new photo URL
            userProfile.PhotoUrl = url;
            userProfile.UpdatedAt = DateTime.UtcNow;
            await _userProfileRepository.SaveChangesAsync();
            
            return url;
        }
        catch (Exception ex) when (!(ex is ArgumentException))
        {
            throw new InvalidOperationException("Failed to upload image to storage", ex);
        }
    }
}
