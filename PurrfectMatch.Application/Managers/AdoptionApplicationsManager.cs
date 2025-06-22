using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using PurrfectMatch.Application.Interfaces.Services;
using PurrfectMatch.Application.Specifications.AdoptionApplications;
using PurrfectMatch.Application.Specifications.ShelterSpecifications;
using PurrfectMatch.Shared.DTOs.AdoptionApplications;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Shared.DTOs.Notifications;

namespace PurrfectMatch.Application.Managers;

public class AdoptionApplicationsManager
{
    private readonly IBaseRepository<AdoptionApplication> _repository;
    private readonly IBaseRepository<Pet> _petRepository;
    private readonly IBaseRepository<ShelterManager> _shelterManagerRepository;
    private readonly IMapper _mapper;
    private readonly INotificationService? _notificationService;
    private readonly IBaseSoftDeleteRepository<AdoptionApplication>? _softDeleteRepository;

    public AdoptionApplicationsManager(
        IBaseRepository<AdoptionApplication> repository,
        IBaseRepository<Pet> petRepository,
        IBaseRepository<ShelterManager> shelterManagerRepository,
        IMapper mapper,
        INotificationService? notificationService = null,
        IBaseSoftDeleteRepository<AdoptionApplication>? softDeleteRepository = null)
    {
        _repository = repository;
        _petRepository = petRepository;
        _shelterManagerRepository = shelterManagerRepository;
        _mapper = mapper;
        _notificationService = notificationService;
        _softDeleteRepository = softDeleteRepository;
    }    public async Task<int> CreateAdoptionApplicationAsync(CreateAdoptionApplicationDto adoptionApplicationDto)
    {
        var adoptionApplication = _mapper.Map<AdoptionApplication>(adoptionApplicationDto);
        await _repository.CreateAsync(adoptionApplication);
        await _repository.SaveChangesAsync();

        // Get the pet with shelter information to find shelter managers
        var pet = await _petRepository.GetAsync(adoptionApplicationDto.PetId);
        if (pet != null)
        {
            // Get all shelter managers for this pet's shelter
            var shelterManagersSpec = new ShelterManagersByShelterId(pet.ShelterId);
            var shelterManagers = await _shelterManagerRepository.ListAsync(shelterManagersSpec);

            // Send notifications to all shelter managers
            if (_notificationService != null && shelterManagers.Any())
            {
                foreach (var shelterManager in shelterManagers)
                {
                    await _notificationService.CreateNotificationAsync(
                        userId: shelterManager.UserId,
                        notificationType: "adoptionapplication",
                        title: "New Adoption Application",
                        message: $"A new adoption application has been submitted for {pet.Name} (ID: {adoptionApplication.ApplicationId})",
                        actionUrl: $"/adoption-applications/{adoptionApplication.ApplicationId}"
                    );
                }
            }
        }

        return adoptionApplication.ApplicationId;
    }

    public async Task<bool> DeleteAdoptionApplicationAsync(int applicationId)
    {
        var application = await _repository.GetAsync(applicationId);
        if (application == null) return false;
        _repository.Delete(application);
        await _repository.SaveChangesAsync();
        return true;
    }

    public async Task<AdoptionApplication?> GetAdoptionApplicationByIdAsync(int id)
    {
        return await _repository.GetAsync(id);
    }

    public async Task<AdoptionApplication?> GetAdoptionApplicationWithDetailsAsync(int id)
    {
        var spec = new AdoptionApplicationWithDetailsSpecification(id);
        return (await _repository.ListAsync(spec)).FirstOrDefault();
    }

    public async Task<IReadOnlyList<AdoptionApplicationDto>> GetAdoptionApplicationsByPetAsync(int petId)
    {
        var specification = new AdoptionApplicationsByPetSpecification(petId);
        var applications = await _repository.ListAsync(specification);
        return _mapper.Map<IReadOnlyList<AdoptionApplicationDto>>(applications);
    }

    public async Task<IReadOnlyList<AdoptionApplicationDto>> GetAdoptionApplicationsByUserAsync(string userId)
    {
        var specification = new AdoptionApplicationsByUserSpecification(userId);
        var applications = await _repository.ListAsync(specification);
        return _mapper.Map<IReadOnlyList<AdoptionApplicationDto>>(applications);
    }

    public async Task<IReadOnlyList<AdoptionApplicationDto>> GetAllAdoptionApplicationsAsync()
    {
        var adoptionApplications = await _repository.ListAllAsync();
        return _mapper.Map<IReadOnlyList<AdoptionApplicationDto>>(adoptionApplications);
    }

    public async Task<bool> SoftDeleteAdoptionApplicationAsync(int applicationId)
    {
        if (_softDeleteRepository == null) throw new InvalidOperationException("Soft delete repository not provided.");
        var application = await _softDeleteRepository.GetAsync(applicationId);
        if (application == null) return false;
        _softDeleteRepository.Delete(application); // Use Delete for soft delete
        await _softDeleteRepository.SaveChangesAsync();
        return true;
    }    public async Task<bool> UpdateAdoptionApplicationStatusAsync(int applicationId, string status)
    {
        var application = await _repository.GetAsync(applicationId);
        if (application == null) return false;
        
        application.Status = status;
        application.UpdatedAt = DateTime.UtcNow;
        _repository.Update(application);

        if (status.Equals("Approved", StringComparison.OrdinalIgnoreCase))
        {
            var pet = await _petRepository.GetAsync(application.PetId);
            if (pet != null)
            {
                pet.IsAdopted = true;
                _petRepository.Update(pet);
            }
        }

        await _repository.SaveChangesAsync();

        // Create notification for the user about the application status update
        if (_notificationService != null)
        {
            var statusLower = status.ToLower();
            var title = $"Adoption Application {status}";
            var message = $"Your adoption application has been {statusLower}.";
            var actionUrl = $"/adoption-applications/{application.ApplicationId}";

            await _notificationService.CreateNotificationAsync(
                userId: application.UserId,
                notificationType: "adoptionApplicationUpdate",
                title: title,
                message: message,
                actionUrl: actionUrl
            );
        }

        return true;
    }

    public async Task<PaginatedAdoptionApplicationsResponseDto> GetFilteredAdoptionApplicationsPaginatedAsync(AdoptionApplicationFilterDto filter)
    {
        var spec = new AdoptionApplicationsFilterSpecification(filter);
        var applications = await _repository.ListAsync(spec);

        // Get the total count using the same filter but without pagination
        var countFilter = new AdoptionApplicationFilterDto
        {
            UserId = filter.UserId,
            PetId = filter.PetId,
            Status = filter.Status,
            ApplicationDateAfter = filter.ApplicationDateAfter,
            ApplicationDateBefore = filter.ApplicationDateBefore,
            CreatedAfter = filter.CreatedAfter,
            CreatedBefore = filter.CreatedBefore,
            IsDeleted = filter.IsDeleted,
            PageNumber = 1,
            PageSize = int.MaxValue
        };
        var countSpec = new AdoptionApplicationsFilterSpecification(countFilter);
        var totalCount = (await _repository.ListAsync(countSpec)).Count;

        var dtos = _mapper.Map<IReadOnlyList<AdoptionApplicationDto>>(applications);
        var totalPages = filter.PageSize > 0 ? (int)Math.Ceiling((double)totalCount / filter.PageSize) : 1;

        return new PaginatedAdoptionApplicationsResponseDto
        {
            Items = dtos,
            TotalCount = totalCount,
            PageNumber = filter.PageNumber,
            PageSize = filter.PageSize,
            TotalPages = totalPages
        };
    }
}
