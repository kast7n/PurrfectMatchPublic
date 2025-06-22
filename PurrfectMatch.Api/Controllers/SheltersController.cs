using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using PurrfectMatch.Application.Managers;
using PurrfectMatch.Shared.DTOs.Shelters;
using PurrfectMatch.Shared.DTOs.Addresses;
using AutoMapper;
using PurrfectMatch.Application.Services;
using PurrfectMatch.Domain.Entities;

namespace PurrfectMatch.Api.Controllers
{    public class SheltersController(
        SheltersManager sheltersManager,
        FollowerService followerService,
        IMapper mapper) : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetFilteredShelters([FromQuery] ShelterFilterDto filter)
        {
            var paginatedResponse = await sheltersManager.GetFilteredSheltersPaginatedAsync(filter);
            return Ok(paginatedResponse);
        }        [HttpGet("all")]
        public async Task<IActionResult> GetAllShelters()
        {
            var shelters = await sheltersManager.GetAllSheltersAsync();
            var shelterDtos = mapper.Map<IReadOnlyList<ShelterDto>>(shelters);
            return Ok(shelterDtos);
        }        [HttpGet("metrics/{id}")]
        public async Task<IActionResult> GetShelterMetrics(int id)
        {
            var metrics = await sheltersManager.GetShelterMetricsAsync(id);
            if (metrics == null) return NotFound();
            return Ok(metrics);
        }

        [HttpGet("followers/{id}")]
        public async Task<IActionResult> GetShelterFollowers(int id)
        {
            var followers = await followerService.GetShelterFollowersAsync(id);
            return Ok(followers);
        }

        [HttpGet("user/{userId}/followed-shelters")]
        public async Task<IActionResult> GetFollowedShelters(string userId)
        {
            var followedShelters = await followerService.GetFollowedSheltersAsync(userId);
            return Ok(followedShelters);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var shelter = await sheltersManager.GetShelterByIdAsync(id);
            if (shelter == null) return NotFound();
            var shelterDto = mapper.Map<ShelterDto>(shelter);
            return Ok(shelterDto);
        }        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateShelterDto shelterDto)
        {
            var shelterId = await sheltersManager.CreateShelterAsync(shelterDto);
            return CreatedAtAction(nameof(GetById), new { id = shelterId }, shelterId);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateShelterDto updateShelterDto)
        {
            var shelter = await sheltersManager.UpdateShelterAsync(id, updateShelterDto);
            if (shelter == null) return NotFound();
            var shelterDto = mapper.Map<ShelterDto>(shelter);
            return Ok(shelterDto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await sheltersManager.DeleteShelterAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }        /// <summary>
        /// Creates a new shelter application
        /// </summary>
        /// <param name="createShelterApplicationDto">The shelter application data</param>
        /// <returns>The created shelter application</returns>
        [HttpPost("applications")]        [Authorize]
        public async Task<IActionResult> CreateShelterApplication([FromBody] CreateShelterApplicationDto createShelterApplicationDto)
        {
            try
            {
                // Get the current user's ID from the JWT token
                var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("No user ID found in JWT token");
                }

                // Debug: Log the userId
                Console.WriteLine($"DEBUG: UserId from JWT: {userId}");

                // Set the UserId from the authenticated user
                createShelterApplicationDto.UserId = userId;

                // Debug: Log the DTO state
                Console.WriteLine($"DEBUG: DTO UserId after setting: {createShelterApplicationDto.UserId}");
                Console.WriteLine($"DEBUG: DTO ShelterName: {createShelterApplicationDto.ShelterName}");

                var result = await sheltersManager.CreateShelterApplicationAsync(createShelterApplicationDto);
                if (result == null)
                {
                    return BadRequest("Failed to create shelter application.");
                }

                return CreatedAtAction(nameof(GetById), new { id = result.RequestId }, result);
            }
            catch (Exception ex)
            {
                // Debug: Log the full exception details
                Console.WriteLine($"DEBUG: Exception in CreateShelterApplication: {ex.Message}");
                Console.WriteLine($"DEBUG: Exception StackTrace: {ex.StackTrace}");
                return BadRequest(new { message = ex.Message });
            }
        }        /// <summary>
        /// Gets all shelter applications with pagination (Admin only)
        /// </summary>
        /// <param name="filter">Filter criteria for applications including pagination</param>
        /// <returns>Paginated list of shelter applications</returns>
        [HttpGet("applications")]
        [Authorize(Roles = "Admin,ShelterAdmin")]
        public async Task<IActionResult> GetShelterApplications([FromQuery] ShelterApplicationFilterDto filter)
        {
            try
            {
                var paginatedResponse = await sheltersManager.GetShelterApplicationsPaginatedAsync(filter);
                return Ok(paginatedResponse);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Gets all shelter applications without pagination (Admin only) - for backward compatibility
        /// </summary>
        /// <param name="filter">Filter criteria for applications</param>
        /// <returns>Simple list of shelter applications</returns>
        [HttpGet("applications/all")]
        [Authorize(Roles = "Admin,ShelterAdmin")]
        public async Task<IActionResult> GetAllShelterApplications([FromQuery] ShelterApplicationFilterDto filter)
        {
            try
            {
                var applications = await sheltersManager.GetShelterApplicationsAsync(filter);
                var applicationDtos = mapper.Map<IReadOnlyList<ShelterCreationRequestDto>>(applications);
                return Ok(applicationDtos);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }/// <summary>
        /// Gets shelter applications for a specific user
        /// </summary>
        /// <param name="userId">The user ID</param>
        /// <returns>List of user's shelter applications</returns>
        [HttpGet("applications/user/{userId}")]
        [Authorize]
        public async Task<IActionResult> GetUserShelterApplications(string userId)
        {
            try
            {
                // Get the current user's ID from the JWT token
                var currentUserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                
                // Users can only see their own applications unless they have admin rights
                if (currentUserId != userId)
                {
                    return Forbid("You can only view your own shelter applications.");
                }

                var filter = new ShelterApplicationFilterDto();
                var applications = await sheltersManager.GetShelterApplicationsAsync(filter);
                var userApplications = applications.Where(a => a.UserId == userId).ToList();
                
                var applicationDtos = mapper.Map<IReadOnlyList<ShelterCreationRequestDto>>(userApplications);
                return Ok(applicationDtos);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }        /// <summary>
        /// Gets a specific shelter application by ID
        /// </summary>
        /// <param name="id">The application ID</param>
        /// <returns>The shelter application</returns>
        [HttpGet("applications/{id}")]
        [Authorize]
        public async Task<IActionResult> GetShelterApplicationById(int id)
        {
            try
            {
                var application = await sheltersManager.GetShelterApplicationByIdAsync(id);
                
                if (application == null)
                {
                    return NotFound($"Shelter application with ID {id} not found.");
                }

                var applicationDto = mapper.Map<ShelterCreationRequestDto>(application);
                return Ok(applicationDto);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }        /// <summary>
        /// Updates the status of a shelter application (Admin only)
        /// </summary>
        /// <param name="id">The application ID</param>
        /// <param name="statusDto">The status update data</param>
        /// <returns>Success or error message</returns>
        [HttpPut("applications/{id}/status")]
        [Authorize(Roles = "Admin,ShelterAdmin")]
        public async Task<IActionResult> UpdateShelterApplicationStatus(int id, [FromBody] UpdateShelterApplicationStatusDto statusDto)
        {
            try
            {
                var result = await sheltersManager.UpdateShelterApplicationStatusAsync(id, statusDto.IsApproved);
                
                if (!result)
                {
                    return NotFound($"Shelter application with ID {id} not found.");
                }

                return Ok(new { message = "Shelter application status updated successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }        /// <summary>
        /// Deletes/cancels a shelter application (users can only delete their own pending applications)
        /// </summary>
        /// <param name="id">The application ID</param>
        /// <returns>Success or error message</returns>
        [HttpDelete("applications/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteShelterApplication(int id)
        {
            try
            {
                // Get the current user's ID from the JWT token
                var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("No user ID found in JWT token");
                }                // First, check if the application exists and belongs to the current user
                var application = await sheltersManager.GetShelterApplicationByIdAsync(id);
                
                if (application == null)
                {
                    return NotFound($"Shelter application with ID {id} not found.");
                }

                // Users can only delete their own applications
                if (application.UserId != userId)
                {
                    return Forbid("You can only delete your own shelter applications.");
                }                // Check if application is still pending (can't delete approved/rejected applications)
                if (application.Status != "Pending")
                {
                    return BadRequest("Cannot delete an application that has already been processed.");
                }

                var result = await sheltersManager.DeleteShelterApplicationAsync(id);
                if (!result)
                {
                    return BadRequest("Failed to delete the shelter application.");
                }

                return Ok(new { message = "Shelter application deleted successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}