using Microsoft.AspNetCore.Mvc;
using PurrfectMatch.Application.Managers;
using PurrfectMatch.Application.Specifications.ShelterSpecifications;
using PurrfectMatch.Shared.DTOs.AdoptionApplications;
using PurrfectMatch.Shared.DTOs.AdoptionApplication;
using PurrfectMatch.Application.Interfaces.Services;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using Microsoft.AspNetCore.Identity;
using PurrfectMatch.Domain.Entities;

namespace PurrfectMatch.Api.Controllers;

public class UpdateAdoptionApplicationStatusDto
{
    public int? Id { get; set; }
    public string? Status { get; set; }
}

public class AdoptionApplicationsController(
    AdoptionApplicationsManager adoptionApplicationsManager,
    IEmailSender emailSender,
    UserManager<User> userManager,
    IBaseRepository<ShelterManager> shelterManagerRepository,
    ILogger<AdoptionApplicationsController> logger) : BaseApiController
{
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateAdoptionApplicationDto adoptionApplicationDto)
    {
        var result = await adoptionApplicationsManager.CreateAdoptionApplicationAsync(adoptionApplicationDto);
        
        // Send email notifications to all shelter managers of this pet's shelter
        try
        {
            // Get adoption application details to access pet information
            var adoptionApplication = await adoptionApplicationsManager.GetAdoptionApplicationWithDetailsAsync(result);
            if (adoptionApplication?.Pet != null)
            {
                // Get all shelter managers for this pet's shelter
                var shelterManagersSpec = new ShelterManagersByShelterId(adoptionApplication.Pet.ShelterId);
                var shelterManagers = await shelterManagerRepository.ListAsync(shelterManagersSpec);

                // Send email to each shelter manager
                foreach (var shelterManager in shelterManagers)
                {
                    var user = await userManager.FindByIdAsync(shelterManager.UserId);
                    if (user != null && !string.IsNullOrEmpty(user.Email))
                    {
                        var petName = adoptionApplication.Pet.Name ?? "a pet";
                        var shelterName = adoptionApplication.Pet.Shelter?.Name ?? "your shelter";
                        var applicationId = adoptionApplication.ApplicationId;

                        await emailSender.SendGeneralNotificationAsync(
                            user,
                            user.Email,
                            "New Adoption Application Received",
                            $"A new adoption application has been submitted for {petName} at {shelterName}. Application ID: {applicationId}. Please log in to review the application."
                        );
                    }
                }
            }
        }
        catch (Exception ex)
        {
            // Log the error but don't fail the application creation
            logger.LogError(ex, "Failed to send email notifications for adoption application {ApplicationId}", result);
        }
        
        return CreatedAtAction(nameof(GetById), new { id = result }, result);
    }[HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await adoptionApplicationsManager.GetAdoptionApplicationByIdAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateAdoptionApplicationStatusDto status)
    {
        if (string.IsNullOrEmpty(status.Status))
        {
            return BadRequest("Status is required.");
        }

        var result = await adoptionApplicationsManager.UpdateAdoptionApplicationStatusAsync(id, status.Status);
        if (!result) return NotFound();

        // Send email notification if status indicates progress
        if (status.Status.ToLower() == "approved" || status.Status.ToLower() == "under review" || status.Status.ToLower() == "interview scheduled")
        {
            try
            {
                // Get the adoption application entity with details
                var adoptionApplication = await adoptionApplicationsManager.GetAdoptionApplicationWithDetailsAsync(id);
                if (adoptionApplication != null)
                {
                    var user = await userManager.FindByIdAsync(adoptionApplication.UserId);
                    if (user != null && !string.IsNullOrEmpty(user.Email))
                    {
                        var petName = adoptionApplication.Pet?.Name ?? "your applied pet";
                        var petType = adoptionApplication.Pet?.Species?.Name ?? "pet";
                        var shelterName = adoptionApplication.Pet?.Shelter?.Name ?? "the shelter";

                        await emailSender.SendAdoptionNotificationAsync(
                            user, 
                            user.Email, 
                            petName,
                            petType,
                            shelterName
                        );
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the error but don't fail the status update
                logger.LogError(ex, "Failed to send adoption notification email for application {ApplicationId}", id);
            }
        }        return Ok(result);
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAll()
    {
        var result = await adoptionApplicationsManager.GetAllAdoptionApplicationsAsync();
        return Ok(result);
    }

    [HttpGet("users/{userId}/adoption-applications")]
    public async Task<IActionResult> GetByUserId(string userId)
    {
        var result = await adoptionApplicationsManager.GetAdoptionApplicationsByUserAsync(userId);
        return Ok(result);
    }

    [HttpGet("pets/{petId}/adoption-applications")]
    public async Task<IActionResult> GetByPetId(int petId)
    {
        var result = await adoptionApplicationsManager.GetAdoptionApplicationsByPetAsync(petId);
        return Ok(result);
    }    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await adoptionApplicationsManager.DeleteAdoptionApplicationAsync(id);
        if (!result) return NotFound();
        return NoContent();
    }

    [HttpGet("filtered")]
    public async Task<IActionResult> GetFiltered([FromQuery] AdoptionApplicationFilterDto filter)
    {
        var paginatedResponse = await adoptionApplicationsManager.GetFilteredAdoptionApplicationsPaginatedAsync(filter);
        return Ok(paginatedResponse);
    }
}
