using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using PurrfectMatch.Application.Managers;
using PurrfectMatch.Shared.DTOs.Users;
using PurrfectMatch.Domain.Entities;
using System.Threading.Tasks;

namespace PurrfectMatch.Api.Controllers
{    [ApiController]
    [Route("api/user-profiles")]
    [Authorize]
    public class UserProfilesController(
        UsersManager usersManager,
        UserManager<User> userManager) : ControllerBase
    {        // POST: api/user-profiles
        // Creates a new user profile.
        [HttpPost]
        public async Task<IActionResult> CreateUserProfile([FromBody] UserProfileDto userProfileDto)
        {
            var user = await userManager.GetUserAsync(User);
            
            if (user == null)
            {
                return Unauthorized();
            }

            // Set the userId from the authenticated user
            userProfileDto.userId = user.Id;
            
            var createdUserProfileDto = await usersManager.CreateUserProfileAsync(userProfileDto);

            if (createdUserProfileDto == null)
            {
                return BadRequest("User profile creation failed.");
            }

            return CreatedAtAction(nameof(GetUserProfileById), new { userId = createdUserProfileDto.userId }, createdUserProfileDto);
        }// GET: api/user-profiles/me
        // Retrieves the current user's profile.
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUserProfile()
        {
            var user = await userManager.GetUserAsync(User);
            
            if (user == null)
            {
                return Unauthorized();
            }
            
            var userProfileDto = await usersManager.GetUserProfileByIdAsync(user.Id);

            if (userProfileDto == null)
            {
                return NotFound("User profile not found. Please create a profile first.");
            }

            return Ok(userProfileDto);
        }

        // GET: api/user-profiles/{userId}
        // Retrieves a user profile by its ID.
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserProfileById(string userId)
        {
            var userProfileDto = await usersManager.GetUserProfileByIdAsync(userId);

            if (userProfileDto == null)
            {
                return NotFound();
            }

            return Ok(userProfileDto);        }

        // PUT: api/user-profiles/me
        // Updates the current user's profile.
        [HttpPut("me")]
        public async Task<IActionResult> UpdateCurrentUserProfile([FromBody] UserProfileDto userProfileDto)
        {
            var user = await userManager.GetUserAsync(User);
            
            if (user == null)
            {
                return Unauthorized();
            }

            var updatedUserProfileDto = await usersManager.UpdateUserProfileAsync(user.Id, userProfileDto);

            if (updatedUserProfileDto == null)
            {
                return NotFound();
            }

            return Ok(updatedUserProfileDto);
        }

        // PUT: api/user-profiles/{userId}
        // Updates an existing user profile.
        [HttpPut("{userId}")]
        public async Task<IActionResult> UpdateUserProfile(string userId, [FromBody] UserProfileDto userProfileDto)
        {
            var updatedUserProfileDto = await usersManager.UpdateUserProfileAsync(userId, userProfileDto);

            if (updatedUserProfileDto == null)
            {
                return NotFound();
            }

            return Ok(updatedUserProfileDto);
        }

        // DELETE: api/user-profiles/{userId}
        // Deletes a user profile.
        [HttpDelete("{userId}")]
        public async Task<IActionResult> DeleteUserProfile(string userId)
        {
            var deleted = await usersManager.DeleteUserProfileAsync(userId);

            if (!deleted)
            {
                return NotFound();
            }

            return NoContent();
        }

        // POST: api/user-profiles/{userId}/photo
        // Uploads a photo for the user profile.
        [HttpPost("{userId}/photo")]
        public async Task<IActionResult> UploadUserPhoto(string userId, IFormFile file)
        {
            try
            {
                var url = await usersManager.UploadUserPhotoAsync(userId, file);
                return Ok(new { Url = url });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST: api/user-profiles/me/photo
        // Uploads a photo for the current user's profile.
        [HttpPost("me/photo")]
        [Authorize]
        public async Task<IActionResult> UploadCurrentUserPhoto(IFormFile file)
        {
            var user = await userManager.GetUserAsync(User);
            
            if (user == null)
            {
                return Unauthorized();
            }

            try
            {
                var url = await usersManager.UploadUserPhotoAsync(user.Id, file);
                return Ok(new { Url = url });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}