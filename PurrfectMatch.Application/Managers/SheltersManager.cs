using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using PurrfectMatch.Application.Interfaces.Services;
using PurrfectMatch.Application.Specifications.ShelterSpecifications;
using PurrfectMatch.Application.Specifications.PetSpecifications;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Domain.Interfaces.IRepositories;
using PurrfectMatch.Shared.DTOs.Shelters;
using PurrfectMatch.Shared.DTOs.Pets;
using PurrfectMatch.Shared.DTOs.Addresses;

namespace PurrfectMatch.Application.Managers;

public class SheltersManager
{
    private readonly IBaseRepository<Shelter> _shelterRepository;
    private readonly IBaseRepository<ShelterCreationRequest> _shelterApplicationRepository;
    private readonly IBaseRepository<ShelterManager> _shelterManagerRepository;
    private readonly IBaseSoftDeleteRepository<Shelter> _softDeleteRepository;
    private readonly IBaseRepository<Pet> _petRepository;
    private readonly IFollowerRepository _followerRepository;
    private readonly IReviewRepository _reviewRepository;
    private readonly AddressesManager _addressesManager;
    private readonly UserManager<User> _userManager;
    private readonly IMapper _mapper;
    private readonly INotificationService? _notificationService;

    public SheltersManager(
        IBaseRepository<Shelter> shelterRepository,
        IBaseRepository<ShelterCreationRequest> shelterApplicationRepository,
        IBaseRepository<ShelterManager> shelterManagerRepository,
        IBaseSoftDeleteRepository<Shelter> softDeleteRepository,
        IBaseRepository<Pet> petRepository,
        IFollowerRepository followerRepository,
        IReviewRepository reviewRepository,
        AddressesManager addressesManager,
        UserManager<User> userManager,
        IMapper mapper,
        INotificationService? notificationService = null)    {
        _shelterRepository = shelterRepository;
        _shelterApplicationRepository = shelterApplicationRepository;
        _shelterManagerRepository = shelterManagerRepository;
        _softDeleteRepository = softDeleteRepository;
        _petRepository = petRepository;
        _followerRepository = followerRepository;
        _reviewRepository = reviewRepository;
        _addressesManager = addressesManager;
        _userManager = userManager;
        _mapper = mapper;
        _notificationService = notificationService;
    }

    public async Task<int> CreateShelterAsync(CreateShelterDto shelterDto)
    {
        var shelter = _mapper.Map<Shelter>(shelterDto);
        await _shelterRepository.CreateAsync(shelter);
        await _shelterRepository.SaveChangesAsync();
        return shelter.ShelterId;
    }    public async Task<Shelter?> GetShelterByIdAsync(int id)
    {
        return await _shelterRepository.GetAsync(id);
    }

    public async Task<IReadOnlyList<Shelter>> GetAllSheltersAsync()
    {
        return await _shelterRepository.ListAllAsync();
    }

    public async Task<IReadOnlyList<Shelter>> GetFilteredSheltersAsync(ShelterFilterDto filter)
    {
        var spec = new ShelterFilterSpecification(filter);
        return await _shelterRepository.ListAsync(spec);
    }

    public async Task<PaginatedSheltersResponseDto> GetFilteredSheltersPaginatedAsync(ShelterFilterDto filter)
    {
        var spec = new ShelterFilterSpecification(filter);
        
        // Get the shelters for the current page
        var shelters = await _shelterRepository.ListAsync(spec);
        
        // Get the total count using the same filter but without pagination
        // Create a copy of the filter with pagination disabled for counting
        var countFilter = new ShelterFilterDto
        {
            Name = filter.Name,
            City = filter.City,
            State = filter.State,
            PhoneNumber = filter.PhoneNumber,
            Email = filter.Email,
            Website = filter.Website,
            DonationUrl = filter.DonationUrl,
            SortBy = filter.SortBy,
            SortDescending = filter.SortDescending,
            PageNumber = 1,
            PageSize = int.MaxValue // This will effectively disable pagination for counting
        };
        var countSpec = new ShelterFilterSpecification(countFilter);
        var totalCount = await _shelterRepository.CountAsync(countSpec);
        
        // Map shelters to DTOs
        var shelterDtos = shelters.Select(shelter => _mapper.Map<ShelterDto>(shelter)).ToList();

        // Calculate total pages
        var totalPages = filter.PageSize > 0 ? (int)Math.Ceiling((double)totalCount / filter.PageSize) : 1;

        return new PaginatedSheltersResponseDto
        {
            Items = shelterDtos,
            TotalCount = totalCount,
            PageNumber = filter.PageNumber,
            PageSize = filter.PageSize,
            TotalPages = totalPages
        };
    }

    public async Task<Shelter?> UpdateShelterAsync(int id, UpdateShelterDto updateShelterDto)
    {
        var shelter = await _shelterRepository.GetAsync(id);
        if (shelter == null) return null;
        _mapper.Map(updateShelterDto, shelter);
        _shelterRepository.Update(shelter);
        await _shelterRepository.SaveChangesAsync();
        return shelter;
    }

    public async Task<bool> SoftDeleteShelterAsync(int id)
    {
        var shelter = await _softDeleteRepository.GetAsync(id);
        if (shelter == null) return false;
        _softDeleteRepository.Delete(shelter);
        await _softDeleteRepository.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteShelterAsync(int id)
    {
        var shelter = await _shelterRepository.GetAsync(id);
        if (shelter == null) return false;
        _shelterRepository.Delete(shelter);
        await _shelterRepository.SaveChangesAsync();
        return true;
    }    public async Task<ShelterCreationRequestDto?> CreateShelterApplicationAsync(CreateShelterApplicationDto createShelterApplicationDto)
    {
        // Debug: Check if UserId is set
        if (string.IsNullOrEmpty(createShelterApplicationDto.UserId))
        {
            throw new ArgumentException("UserId is required in CreateShelterApplicationDto");
        }        // First, create the address if provided
        int addressId = 0;
        if (createShelterApplicationDto.Address != null)
        {
            // Convert Shelters.AddressDto to Addresses.AddressDto
            var addressDto = new PurrfectMatch.Shared.DTOs.Addresses.AddressDto
            {
                Street = createShelterApplicationDto.Address.Street,
                City = createShelterApplicationDto.Address.City,
                State = createShelterApplicationDto.Address.State,
                PostalCode = createShelterApplicationDto.Address.PostalCode,
                Country = createShelterApplicationDto.Address.Country
            };
            addressId = await _addressesManager.CreateAddressAsync(addressDto);
        }

        var shelterApplication = _mapper.Map<ShelterCreationRequest>(createShelterApplicationDto);
        
        // Debug: Check if UserId was mapped correctly
        if (string.IsNullOrEmpty(shelterApplication.UserId))
        {
            throw new ArgumentException("UserId was not mapped correctly to ShelterCreationRequest entity");
        }

        // Set the address ID from the created address
        shelterApplication.AddressId = addressId;
        
        // Store address information as a string for display purposes
        if (createShelterApplicationDto.Address != null)
        {
            shelterApplication.RequestedAddress = $"{createShelterApplicationDto.Address.Street}, {createShelterApplicationDto.Address.City}, {createShelterApplicationDto.Address.State} {createShelterApplicationDto.Address.PostalCode}, {createShelterApplicationDto.Address.Country}";
        }        await _shelterApplicationRepository.CreateAsync(shelterApplication);
        await _shelterApplicationRepository.SaveChangesAsync();

        // Send notifications to all admin users about the new shelter application
        if (_notificationService != null && _userManager != null)
        {
            try
            {
                // Get all users with Admin role
                var adminUsers = await _userManager.GetUsersInRoleAsync("Admin");
                
                foreach (var admin in adminUsers)
                {
                    await _notificationService.CreateNotificationAsync(
                        userId: admin.Id,
                        notificationType: "shelterApplication",
                        title: "New Shelter Application Received",
                        message: $"A new shelter application has been submitted for '{shelterApplication.ShelterName}' by user {shelterApplication.UserId}. Please review the application in the admin dashboard.",
                        actionUrl: $"/dashboard/shelters/applications"
                    );
                }
            }
            catch (Exception ex)
            {
                // Log the error but don't fail the application creation
                // You might want to inject a logger here
                Console.WriteLine($"Error sending notifications for shelter application {shelterApplication.RequestId}: {ex.Message}");
            }
        }

        return _mapper.Map<ShelterCreationRequestDto>(shelterApplication);
    }

    public async Task<IReadOnlyList<ShelterCreationRequest>> GetShelterApplicationsAsync(ShelterApplicationFilterDto filter)
    {
        var spec = new ShelterApplicationFilterSpecification(filter);
        return await _shelterApplicationRepository.ListAsync(spec);
    }

    public async Task<PaginatedShelterApplicationsResponseDto> GetShelterApplicationsPaginatedAsync(ShelterApplicationFilterDto filter)
    {
        var spec = new ShelterApplicationFilterSpecification(filter);
        
        // Get the applications for the current page
        var applications = await _shelterApplicationRepository.ListAsync(spec);
        
        // Get the total count using the same filter but without pagination
        var countFilter = new ShelterApplicationFilterDto
        {
            IsApproved = filter.IsApproved,
            CreatedAfter = filter.CreatedAfter,
            CreatedBefore = filter.CreatedBefore,
            SortBy = filter.SortBy,
            SortDescending = filter.SortDescending,
            PageNumber = 1,
            PageSize = int.MaxValue // This will effectively disable pagination for counting
        };
        var countSpec = new ShelterApplicationFilterSpecification(countFilter);
        var totalCount = await _shelterApplicationRepository.CountAsync(countSpec);
        
        // Map applications to DTOs
        var applicationDtos = applications.Select(app => _mapper.Map<ShelterCreationRequestDto>(app)).ToList();

        // Calculate total pages
        var totalPages = filter.PageSize > 0 ? (int)Math.Ceiling((double)totalCount / filter.PageSize) : 1;

        return new PaginatedShelterApplicationsResponseDto
        {
            Items = applicationDtos,
            TotalCount = totalCount,
            PageNumber = filter.PageNumber,
            PageSize = filter.PageSize,
            TotalPages = totalPages
        };
    }

    public async Task<ShelterCreationRequest?> GetShelterApplicationByIdAsync(int applicationId)
    {
        return await _shelterApplicationRepository.GetAsync(applicationId);
    }    public async Task<bool> UpdateShelterApplicationStatusAsync(int applicationId, bool isApproved)
    {
        var application = await _shelterApplicationRepository.GetAsync(applicationId);
        if (application == null) return false;

        // Update application status
        application.IsApproved = isApproved;
        application.Status = isApproved ? "Approved" : "Rejected";
        application.UpdatedAt = DateTime.UtcNow;
        application.Remarks = isApproved ? "Application approved by admin" : "Application rejected by admin";

        // If approved, create the shelter and assign the user as shelter manager
        if (isApproved)
        {
            try
            {                // Get the address from the application
                var address = await _addressesManager.GetAddressByIdAsync(application.AddressId);
                
                // Create the shelter address DTO
                PurrfectMatch.Shared.DTOs.Shelters.AddressDto? shelterAddressDto = null;
                if (address != null)
                {
                    shelterAddressDto = new PurrfectMatch.Shared.DTOs.Shelters.AddressDto
                    {
                        Street = address.Street,
                        City = address.City,
                        State = address.State,
                        PostalCode = address.PostalCode,
                        Country = address.Country,
                        GoogleMapLink = address.GoogleMapLink
                    };
                }
                
                // Create the shelter
                var createShelterDto = new CreateShelterDto
                {
                    Name = application.ShelterName,
                    Description = $"Shelter created from approved application on {DateTime.UtcNow:yyyy-MM-dd}",
                    Address = shelterAddressDto
                };

                var shelterId = await CreateShelterAsync(createShelterDto);

                // Get the user who applied
                var user = await _userManager.FindByIdAsync(application.UserId);
                if (user != null)
                {
                    // Assign ShelterManager role if not already assigned
                    var userRoles = await _userManager.GetRolesAsync(user);
                    if (!userRoles.Contains("ShelterManager"))
                    {
                        await _userManager.AddToRoleAsync(user, "ShelterManager");
                    }

                    // Create ShelterManager record
                    var shelterManager = new ShelterManager
                    {
                        UserId = user.Id,
                        ShelterId = shelterId,
                        CreatedAt = DateTime.UtcNow
                    };

                    await _shelterManagerRepository.CreateAsync(shelterManager);
                    await _shelterManagerRepository.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                // Log the error but don't fail the application approval
                // You might want to inject a logger here
                Console.WriteLine($"Error creating shelter for approved application {applicationId}: {ex.Message}");
                
                // Optionally, you could revert the application status here
                // For now, we'll let the application approval go through
            }        }

        _shelterApplicationRepository.Update(application);
        await _shelterApplicationRepository.SaveChangesAsync();

        // Create notification for the user about the application status update
        if (_notificationService != null)
        {
            var statusText = isApproved ? "approved" : "rejected";
            var title = $"Shelter Application {statusText.Substring(0, 1).ToUpper()}{statusText.Substring(1)}";
            var message = $"Your shelter application for '{application.ShelterName}' has been {statusText}.";
            var actionUrl = isApproved ? "/dashboard/shelters" : "/dashboard/applications";

            await _notificationService.CreateNotificationAsync(
                userId: application.UserId,
                notificationType: "shelterApplicationUpdate",
                title: title,
                message: message,
                actionUrl: actionUrl
            );
        }

        return true;
    }

    public async Task<bool> DeleteShelterApplicationAsync(int applicationId)
    {
        var application = await _shelterApplicationRepository.GetAsync(applicationId);
        if (application == null) return false;
        
        // Only allow deletion of pending applications
        if (application.Status != "Pending")
        {
            return false;
        }
        
        _shelterApplicationRepository.Delete(application);
        await _shelterApplicationRepository.SaveChangesAsync();
        return true;
    }    public async Task<ShelterMetricsDto?> GetShelterMetricsAsync(int shelterId)
    {
        var shelter = await _shelterRepository.GetAsync(shelterId);
        if (shelter == null) return null;
        
        // Get available pets (not adopted)
        var availablePetFilter = new PetFilterDto 
        { 
            ShelterId = shelterId,
            PageSize = int.MaxValue,
            IsAdopted = false,
            IsDeleted = false
        };
        var availablePetsList = await _petRepository.ListAsync(new PetsFilterSpecification(availablePetFilter));
        var availablePets = availablePetsList.Count;
        
        // Get adopted pets
        var adoptedPetFilter = new PetFilterDto 
        { 
            ShelterId = shelterId,
            PageSize = int.MaxValue,
            IsAdopted = true,
            IsDeleted = false
        };
        var adoptedPetsList = await _petRepository.ListAsync(new PetsFilterSpecification(adoptedPetFilter));
        var adoptedPets = adoptedPetsList.Count;var followers = await _followerRepository.GetShelterFollowersAsync(shelterId);
        var followerCount = followers.Count;
        
        var reviews = await _reviewRepository.GetShelterReviewsAsync(shelterId);
        var averageRating = reviews.Any() ? (decimal)reviews.Average(r => r.Rating) : 0;
        var reviewCount = reviews.Count;
          var shelterMetrics = _mapper.Map<ShelterMetricsDto>(shelter);
        shelterMetrics.TotalPets = availablePets + adoptedPets;
        shelterMetrics.AvailablePets = availablePets;
        shelterMetrics.AdoptedPets = adoptedPets;
        shelterMetrics.FollowerCount = followerCount;
        shelterMetrics.AverageRating = averageRating;
        shelterMetrics.ReviewCount = reviewCount;
        return shelterMetrics;
    }
}
