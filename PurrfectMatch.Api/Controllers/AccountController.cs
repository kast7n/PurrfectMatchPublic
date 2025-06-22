using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Shared.DTOs.Identity;
using System.Text.Encodings.Web;
using PurrfectMatch.Infrastructure.Services;
using Serilog;
using PurrfectMatch.Shared.DTOs.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using PurrfectMatch.Infrastructure.Data;

namespace PurrfectMatch.Api.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly SignInManager<User> _signInManager;
        private readonly IEmailSender<User> _emailSender;
        private readonly ApplicationIdentityDbContext _identityContext;
        private readonly PurrfectMatchContext _context;
        private readonly IConfiguration _configuration;

        public AccountController(
            SignInManager<User> signInManager,
            IEmailSender<User> emailSender,
            ApplicationIdentityDbContext identityContext,
            PurrfectMatchContext context,
            IConfiguration configuration)
        {
            _signInManager = signInManager;
            _emailSender = emailSender;
            _identityContext = identityContext;
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<ActionResult> RegisterUser(RegisterDto registerDto)
        {
            var user = new User { UserName = registerDto.Email, Email = registerDto.Email };

            var result = await _signInManager.UserManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(error.Code, error.Description);
                }

                return ValidationProblem();
            }

            // Generate email confirmation token
            var token = await _signInManager.UserManager.GenerateEmailConfirmationTokenAsync(user);

            // Build confirmation link
            var confirmationLink = Url.Action(
                nameof(ConfirmEmail),
                "Account",
                new { userId = user.Id, token },
                Request.Scheme);            // Send confirmation email using the custom email sender
            if (!string.IsNullOrEmpty(confirmationLink))
            {
                await _emailSender.SendConfirmationLinkAsync(user, user.Email, confirmationLink);
            }

            return Ok(new { message = "Registration successful. Please check your email to confirm your account." });
        }

        [HttpGet("confirm-email")]
        public async Task<ActionResult> ConfirmEmail(string userId, string token)
        {
            var user = await _signInManager.UserManager.FindByIdAsync(userId);
            if (user == null)
                return BadRequest("Invalid user ID.");

            var result = await _signInManager.UserManager.ConfirmEmailAsync(user, token);
            if (!result.Succeeded)
                return BadRequest("Email confirmation failed.");

            return Ok("Email confirmed successfully.");
        }        [HttpGet("user-info")]
        public async Task<ActionResult> GetUserInfo()
        {
            try
            {
                Serilog.Log.Information("GetUserInfo called - User.Identity.IsAuthenticated: {IsAuthenticated}", User.Identity?.IsAuthenticated);
                
                if (User.Identity?.IsAuthenticated != true)
                {
                    Serilog.Log.Warning("User is not authenticated");
                    return Unauthorized();
                }

                var user = await _signInManager.UserManager.GetUserAsync(User);
                
                if (user == null)
                {
                    Serilog.Log.Warning("User not found in database - Claims: {@Claims}", User.Claims.Select(c => new { c.Type, c.Value }));
                    return Unauthorized();
                }

                Serilog.Log.Information("Found user: {UserId} - {Email}", user.Id, user.Email);                var roles = await _signInManager.UserManager.GetRolesAsync(user);
                
                Serilog.Log.Information("User {Email} has roles: {@Roles}", user.Email, roles);

                // Get shelter information for shelter managers
                int? shelterId = null;
                string? shelterName = null;
                
                if (roles.Contains("ShelterManager"))
                {
                    var shelterManager = await _context.ShelterManagers
                        .Include(sm => sm.Shelter)
                        .FirstOrDefaultAsync(sm => sm.UserId == user.Id);
                    
                    if (shelterManager != null)
                    {
                        shelterId = shelterManager.ShelterId;
                        shelterName = shelterManager.Shelter.Name;
                    }
                }

                var response = new
                {
                    user.UserName,
                    user.Email,
                    user.Id,
                    Roles = roles,
                    ShelterId = shelterId,
                    ShelterName = shelterName
                };

                Serilog.Log.Information("Returning user info: {@UserInfo}", response);

                return Ok(response);
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex, "Error in GetUserInfo");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("logout")]
        public async Task<ActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return NoContent();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Microsoft.AspNetCore.Identity.Data.LoginRequest request)
        {
            Serilog.Log.Information("Login attempt for user: {Email}", request.Email);

            try
            {
                var result = await _signInManager.PasswordSignInAsync(request.Email, request.Password, isPersistent: true, lockoutOnFailure: true);

                if (result.Succeeded)
                {
                    Serilog.Log.Information("User {Email} logged in successfully.", request.Email);
                    return Ok();
                }

                if (result.IsLockedOut)
                {
                    Serilog.Log.Warning("User {Email} account is locked out.", request.Email);
                    return Forbid();
                }

                Serilog.Log.Warning("Invalid login attempt for user: {Email}", request.Email);
                return Unauthorized();
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex, "An error occurred during login for user: {Email}", request.Email);
                return StatusCode(500, "Internal server error");
            }
        }

        // User Management Endpoints

        [HttpGet("users")]
        [Authorize(Roles = "Admin,ShelterManager")]        public async Task<ActionResult<object>> GetUsers([FromQuery] UserFilterDto filter)
        {
            try
            {
                Serilog.Log.Information("GetUsers called with filter: {@Filter}", filter);
                
                var currentUser = await _signInManager.UserManager.GetUserAsync(User);
                if (currentUser == null) 
                {
                    Serilog.Log.Warning("GetUsers: Current user not found");
                    return Unauthorized();
                }

                var roles = await _signInManager.UserManager.GetRolesAsync(currentUser);
                var isAdmin = roles.Contains("Admin");
                var isShelterManager = roles.Contains("ShelterManager");
                
                Serilog.Log.Information("GetUsers: Current user {Email} has roles: {@Roles}, isAdmin: {IsAdmin}, isShelterManager: {IsShelterManager}", 
                    currentUser.Email, roles, isAdmin, isShelterManager);

                IQueryable<User> query = _identityContext.Users;                // Apply shelter filtering for shelter managers
                if (isShelterManager && !isAdmin)
                {
                    var shelterManager = await _context.ShelterManagers
                        .FirstOrDefaultAsync(sm => sm.UserId == currentUser.Id);
                    
                    if (shelterManager == null)
                    {
                        Serilog.Log.Warning("GetUsers: Shelter manager {Email} is not associated with any shelter", currentUser.Email);
                        // Return empty result instead of error for shelter managers without shelters
                        return Ok(new
                        {
                            items = new List<object>(),
                            totalCount = 0,
                            pageNumber = filter.PageNumber,
                            pageSize = filter.PageSize,
                            totalPages = 0
                        });
                    }

                    Serilog.Log.Information("GetUsers: Filtering for shelter {ShelterId}", shelterManager.ShelterId);

                    // Get user IDs in the same shelter
                    var shelterUserIds = await _context.ShelterManagers
                        .Where(sm => sm.ShelterId == shelterManager.ShelterId)
                        .Select(sm => sm.UserId)
                        .ToListAsync();

                    query = query.Where(u => shelterUserIds.Contains(u.Id));
                }

                // Apply filters
                if (!string.IsNullOrEmpty(filter.Email))
                    query = query.Where(u => u.Email!.Contains(filter.Email));

                if (!string.IsNullOrEmpty(filter.UserName))
                    query = query.Where(u => u.UserName!.Contains(filter.UserName));

                if (filter.EmailConfirmed.HasValue)
                    query = query.Where(u => u.EmailConfirmed == filter.EmailConfirmed.Value);

                if (filter.IsLockedOut.HasValue)
                {
                    if (filter.IsLockedOut.Value)
                        query = query.Where(u => u.LockoutEnd.HasValue && u.LockoutEnd > DateTimeOffset.UtcNow);
                    else
                        query = query.Where(u => !u.LockoutEnd.HasValue || u.LockoutEnd <= DateTimeOffset.UtcNow);
                }                if (filter.ShelterId.HasValue)
                {
                    var shelterUserIds = await _context.ShelterManagers
                        .Where(sm => sm.ShelterId == filter.ShelterId.Value)
                        .Select(sm => sm.UserId)
                        .ToListAsync();
                    query = query.Where(u => shelterUserIds.Contains(u.Id));
                }

                // Apply sorting
                query = filter.SortBy?.ToLower() switch
                {
                    "username" => filter.SortDescending ? query.OrderByDescending(u => u.UserName) : query.OrderBy(u => u.UserName),
                    "email" => filter.SortDescending ? query.OrderByDescending(u => u.Email) : query.OrderBy(u => u.Email),
                    "emailconfirmed" => filter.SortDescending ? query.OrderByDescending(u => u.EmailConfirmed) : query.OrderBy(u => u.EmailConfirmed),
                    _ => filter.SortDescending ? query.OrderByDescending(u => u.Email) : query.OrderBy(u => u.Email)
                };                var totalCount = await query.CountAsync();
                Serilog.Log.Information("GetUsers: Total count: {TotalCount}", totalCount);
                
                var users = await query
                    .Skip((filter.PageNumber - 1) * filter.PageSize)
                    .Take(filter.PageSize)
                    .ToListAsync();

                Serilog.Log.Information("GetUsers: Retrieved {UserCount} users", users.Count);var userDtos = new List<UserDto>();

                foreach (var user in users)
                {
                    var userRoles = await _signInManager.UserManager.GetRolesAsync(user);
                    var shelterManager = await _context.ShelterManagers
                        .Include(sm => sm.Shelter)
                        .FirstOrDefaultAsync(sm => sm.UserId == user.Id);
                    
                    userDtos.Add(new UserDto
                    {
                        Id = isAdmin ? user.Id : "", // Hide ID for non-admins
                        UserName = user.UserName,
                        Email = user.Email,
                        EmailConfirmed = user.EmailConfirmed,
                        PhoneNumber = user.PhoneNumber,
                        PhoneNumberConfirmed = user.PhoneNumberConfirmed,                        TwoFactorEnabled = user.TwoFactorEnabled,
                        LockoutEnd = user.LockoutEnd,
                        LockoutEnabled = user.LockoutEnabled,
                        AccessFailedCount = user.AccessFailedCount,
                        Roles = userRoles.ToList(),
                        CreatedAt = DateTime.UtcNow, // Default since Identity doesn't track creation time
                        ShelterName = shelterManager?.Shelter?.Name,
                        ShelterId = shelterManager?.ShelterId
                    });                }

                Serilog.Log.Information("GetUsers: Successfully returning {UserCount} users", userDtos.Count);

                return Ok(new
                {
                    items = userDtos,
                    totalCount,
                    pageNumber = filter.PageNumber,
                    pageSize = filter.PageSize,
                    totalPages = (int)Math.Ceiling(totalCount / (double)filter.PageSize)
                });
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex, "Error in GetUsers");
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpDelete("users/{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteUser(string userId)
        {
            try
            {
                var user = await _signInManager.UserManager.FindByIdAsync(userId);
                if (user == null)
                    return NotFound("User not found");

                var result = await _signInManager.UserManager.DeleteAsync(user);
                if (!result.Succeeded)
                    return BadRequest(result.Errors);

                return Ok("User deleted successfully");
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex, "Error deleting user {UserId}", userId);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("users/assign-shelter-manager")]
        [Authorize(Roles = "Admin,ShelterManager")]
        public async Task<ActionResult> AssignShelterManager([FromBody] AssignShelterManagerDto dto)
        {
            try
            {
                var currentUser = await _signInManager.UserManager.GetUserAsync(User);
                if (currentUser == null) return Unauthorized();

                var roles = await _signInManager.UserManager.GetRolesAsync(currentUser);
                var isAdmin = roles.Contains("Admin");
                var isShelterManager = roles.Contains("ShelterManager");

                // Check if current user can manage this shelter
                if (isShelterManager && !isAdmin)
                {
                    var currentUserShelterManager = await _context.ShelterManagers
                        .FirstOrDefaultAsync(sm => sm.UserId == currentUser.Id && sm.ShelterId == dto.ShelterId);
                    
                    if (currentUserShelterManager == null)
                        return Forbid("You can only assign managers to your own shelter.");
                }

                var targetUser = await _signInManager.UserManager.FindByEmailAsync(dto.Email);
                if (targetUser == null)
                    return NotFound("User not found with this email");

                // Check if user is already a shelter manager for this shelter
                var existingShelterManager = await _context.ShelterManagers
                    .FirstOrDefaultAsync(sm => sm.UserId == targetUser.Id && sm.ShelterId == dto.ShelterId);

                if (existingShelterManager != null)
                    return BadRequest("User is already a manager for this shelter");

                // Assign ShelterManager role if not already assigned
                var userRoles = await _signInManager.UserManager.GetRolesAsync(targetUser);
                if (!userRoles.Contains("ShelterManager"))
                {
                    var roleResult = await _signInManager.UserManager.AddToRoleAsync(targetUser, "ShelterManager");
                    if (!roleResult.Succeeded)
                        return BadRequest(roleResult.Errors);
                }

                // Add to ShelterManager table
                var shelterManager = new ShelterManager
                {
                    UserId = targetUser.Id,
                    ShelterId = dto.ShelterId,
                    CreatedAt = DateTime.UtcNow
                };

                _context.ShelterManagers.Add(shelterManager);
                await _context.SaveChangesAsync();

                return Ok("User assigned as shelter manager successfully");
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex, "Error assigning shelter manager");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("users/remove-shelter-manager")]
        [Authorize(Roles = "Admin,ShelterManager")]
        public async Task<ActionResult> RemoveShelterManager([FromBody] RemoveShelterManagerDto dto)
        {
            try
            {
                var currentUser = await _signInManager.UserManager.GetUserAsync(User);
                if (currentUser == null) return Unauthorized();

                var roles = await _signInManager.UserManager.GetRolesAsync(currentUser);
                var isAdmin = roles.Contains("Admin");
                var isShelterManager = roles.Contains("ShelterManager");

                // Check if current user can manage this shelter
                if (isShelterManager && !isAdmin)
                {
                    var currentUserShelterManager = await _context.ShelterManagers
                        .FirstOrDefaultAsync(sm => sm.UserId == currentUser.Id && sm.ShelterId == dto.ShelterId);
                    
                    if (currentUserShelterManager == null)
                        return Forbid("You can only remove managers from your own shelter.");
                }

                var targetUser = await _signInManager.UserManager.FindByIdAsync(dto.UserId);
                if (targetUser == null)
                    return NotFound("User not found");

                // Remove from ShelterManager table
                var shelterManager = await _context.ShelterManagers
                    .FirstOrDefaultAsync(sm => sm.UserId == dto.UserId && sm.ShelterId == dto.ShelterId);

                if (shelterManager == null)
                    return NotFound("User is not a manager for this shelter");

                _context.ShelterManagers.Remove(shelterManager);

                // Check if user is manager for other shelters
                var otherShelterManagers = await _context.ShelterManagers
                    .Where(sm => sm.UserId == dto.UserId && sm.ShelterId != dto.ShelterId)
                    .CountAsync();

                // If no other shelter manager roles, remove the ShelterManager role
                if (otherShelterManagers == 0)
                {
                    var roleResult = await _signInManager.UserManager.RemoveFromRoleAsync(targetUser, "ShelterManager");
                    if (!roleResult.Succeeded)
                        return BadRequest(roleResult.Errors);
                }

                await _context.SaveChangesAsync();

                return Ok("Shelter manager removed successfully");
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex, "Error removing shelter manager");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("users/{userId}/role")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> UpdateUserRole(string userId, [FromBody] UpdateUserRoleDto dto)
        {
            try
            {
                if (userId != dto.UserId)
                    return BadRequest("User ID mismatch");

                var user = await _signInManager.UserManager.FindByIdAsync(userId);
                if (user == null)
                    return NotFound("User not found");

                var currentRoles = await _signInManager.UserManager.GetRolesAsync(user);
                
                // Remove all current roles
                if (currentRoles.Any())
                {
                    var removeResult = await _signInManager.UserManager.RemoveFromRolesAsync(user, currentRoles);
                    if (!removeResult.Succeeded)
                        return BadRequest(removeResult.Errors);
                }

                // Add new role
                var addResult = await _signInManager.UserManager.AddToRoleAsync(user, dto.Role);
                if (!addResult.Succeeded)
                    return BadRequest(addResult.Errors);

                // If removing ShelterManager role, also remove from ShelterManager table
                if (currentRoles.Contains("ShelterManager") && dto.Role != "ShelterManager")
                {
                    var shelterManagers = await _context.ShelterManagers
                        .Where(sm => sm.UserId == userId)
                        .ToListAsync();
                    
                    _context.ShelterManagers.RemoveRange(shelterManagers);
                    await _context.SaveChangesAsync();
                }

                return Ok("User role updated successfully");
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex, "Error updating user role {UserId}", userId);
                return StatusCode(500, "Internal server error");
            }
        }        [HttpPut("users/{userId}/shelter")]
        [Authorize(Roles = "Admin,ShelterManager")]
        public async Task<ActionResult> UpdateUserShelter(string userId, [FromBody] UpdateUserShelterDto dto)
        {
            try
            {
                Serilog.Log.Information("UpdateUserShelter called for user {UserId} with dto: {@Dto}", userId, dto);
                
                if (userId != dto.UserId)
                    return BadRequest("User ID mismatch");

                var currentUser = await _signInManager.UserManager.GetUserAsync(User);
                if (currentUser == null) return Unauthorized();

                var roles = await _signInManager.UserManager.GetRolesAsync(currentUser);
                var isAdmin = roles.Contains("Admin");
                var isShelterManager = roles.Contains("ShelterManager");

                var targetUser = await _signInManager.UserManager.FindByIdAsync(userId);
                if (targetUser == null)
                    return NotFound("User not found");

                Serilog.Log.Information("Current user {CurrentUserId} is admin: {IsAdmin}, shelter manager: {IsShelterManager}", 
                    currentUser.Id, isAdmin, isShelterManager);

                // Check permissions for shelter managers
                if (isShelterManager && !isAdmin)
                {
                    var currentUserShelterManager = await _context.ShelterManagers
                        .FirstOrDefaultAsync(sm => sm.UserId == currentUser.Id);
                    
                    if (currentUserShelterManager == null)
                        return Forbid("You are not associated with any shelter.");

                    // Can only manage users in their own shelter
                    if (dto.OldShelterId.HasValue && dto.OldShelterId != currentUserShelterManager.ShelterId)
                        return Forbid("You can only manage users in your own shelter.");
                        
                    if (dto.NewShelterId.HasValue && dto.NewShelterId != currentUserShelterManager.ShelterId)
                        return Forbid("You can only assign users to your own shelter.");
                }// Remove from old shelter if specified
                if (dto.OldShelterId.HasValue)
                {
                    var oldShelterManagers = await _context.ShelterManagers
                        .Where(sm => sm.UserId == userId && sm.ShelterId == dto.OldShelterId.Value)
                        .ToListAsync();
                    
                    if (oldShelterManagers.Any())
                    {
                        _context.ShelterManagers.RemoveRange(oldShelterManagers);
                    }
                }

                // Add to new shelter if specified
                if (dto.NewShelterId.HasValue)
                {
                    // Check if already assigned to this shelter
                    var existingShelterManager = await _context.ShelterManagers
                        .FirstOrDefaultAsync(sm => sm.UserId == userId && sm.ShelterId == dto.NewShelterId.Value);

                    if (existingShelterManager == null)
                    {
                        // Ensure user has ShelterManager role
                        var userRoles = await _signInManager.UserManager.GetRolesAsync(targetUser);
                        if (!userRoles.Contains("ShelterManager"))
                        {
                            var roleResult = await _signInManager.UserManager.AddToRoleAsync(targetUser, "ShelterManager");
                            if (!roleResult.Succeeded)
                                return BadRequest(roleResult.Errors);
                        }

                        var newShelterManager = new ShelterManager
                        {
                            UserId = userId,
                            ShelterId = dto.NewShelterId.Value,
                            CreatedAt = DateTime.UtcNow
                        };

                        _context.ShelterManagers.Add(newShelterManager);
                    }
                }

                // If user has no shelters left, remove ShelterManager role
                if (!dto.NewShelterId.HasValue)
                {
                    var remainingShelters = await _context.ShelterManagers
                        .Where(sm => sm.UserId == userId)
                        .CountAsync();

                    if (remainingShelters == 0)
                    {
                        var roleResult = await _signInManager.UserManager.RemoveFromRoleAsync(targetUser, "ShelterManager");
                        if (!roleResult.Succeeded)
                            return BadRequest(roleResult.Errors);
                    }
                }                await _context.SaveChangesAsync();
                
                Serilog.Log.Information("Successfully updated shelter assignment for user {UserId}", userId);
                return Ok("User shelter assignment updated successfully");
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex, "Error updating user shelter {UserId}", userId);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("users/{userId}/details")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> UpdateUserDetails(string userId, [FromBody] UpdateUserDetailsDto dto)
        {
            try
            {
                if (userId != dto.UserId)
                    return BadRequest("User ID mismatch");

                var user = await _signInManager.UserManager.FindByIdAsync(userId);
                if (user == null)
                    return NotFound("User not found");

                // Update user properties
                if (!string.IsNullOrEmpty(dto.UserName))
                    user.UserName = dto.UserName;
                
                if (!string.IsNullOrEmpty(dto.Email))
                    user.Email = dto.Email;
                
                if (!string.IsNullOrEmpty(dto.PhoneNumber))
                    user.PhoneNumber = dto.PhoneNumber;
                
                if (dto.EmailConfirmed.HasValue)
                    user.EmailConfirmed = dto.EmailConfirmed.Value;
                
                if (dto.LockoutEnabled.HasValue)
                    user.LockoutEnabled = dto.LockoutEnabled.Value;
                
                if (dto.LockoutEnd.HasValue)
                    user.LockoutEnd = dto.LockoutEnd.Value;

                var result = await _signInManager.UserManager.UpdateAsync(user);
                if (!result.Succeeded)
                    return BadRequest(result.Errors);

                return Ok("User details updated successfully");
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex, "Error updating user details {UserId}", userId);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("change-password")]
        [Authorize]
        public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordDto changePasswordDto)
        {
            try
            {
                var user = await _signInManager.UserManager.GetUserAsync(User);
                if (user == null)
                {
                    return Unauthorized();
                }

                // Validate current password
                var isCurrentPasswordValid = await _signInManager.UserManager.CheckPasswordAsync(user, changePasswordDto.CurrentPassword);
                if (!isCurrentPasswordValid)
                {
                    return BadRequest("Current password is incorrect.");
                }

                // Validate new password confirmation
                if (changePasswordDto.NewPassword != changePasswordDto.ConfirmPassword)
                {
                    return BadRequest("New password and confirmation do not match.");
                }

                // Change the password
                var result = await _signInManager.UserManager.ChangePasswordAsync(user, changePasswordDto.CurrentPassword, changePasswordDto.NewPassword);
                
                if (!result.Succeeded)
                {
                    var errors = result.Errors.Select(e => e.Description).ToList();
                    return BadRequest(new { message = "Password change failed.", errors });
                }                Serilog.Log.Information("Password changed successfully for user {UserId}", user.Id);
                return Ok(new { message = "Password changed successfully." });
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex, "Error changing password for user");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("forgot-password")]
        public async Task<ActionResult> ForgotPassword([FromBody] ForgotPasswordDto forgotPasswordDto)
        {
            try
            {
                var user = await _signInManager.UserManager.FindByEmailAsync(forgotPasswordDto.Email);
                
                // For security reasons, we don't reveal whether the email exists or not
                if (user == null)
                {
                    return Ok(new { message = "If your email address is registered with us, you will receive a password reset link shortly." });
                }

                // Check if email is confirmed
                if (!await _signInManager.UserManager.IsEmailConfirmedAsync(user))
                {
                    return BadRequest(new { message = "Email address is not confirmed. Please confirm your email first." });
                }                // Generate password reset token
                var token = await _signInManager.UserManager.GeneratePasswordResetTokenAsync(user);

                // Get frontend base URL from configuration
                var frontendBaseUrl = _configuration["Frontend:BaseUrl"] ?? "https://localhost:3000";
                
                // Build reset link - this should point to your frontend reset password page
                var resetLink = $"{frontendBaseUrl}/reset-password?email={Uri.EscapeDataString(forgotPasswordDto.Email)}&token={Uri.EscapeDataString(token)}";// Send password reset email
                await _emailSender.SendPasswordResetLinkAsync(user, user.Email!, resetLink);

                Serilog.Log.Information("Password reset email sent to user: {Email}", forgotPasswordDto.Email);
                
                return Ok(new { message = "If your email address is registered with us, you will receive a password reset link shortly." });
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex, "Error sending password reset email for: {Email}", forgotPasswordDto.Email);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("reset-password")]
        public async Task<ActionResult> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
        {
            try
            {
                var user = await _signInManager.UserManager.FindByEmailAsync(resetPasswordDto.Email);
                if (user == null)
                {
                    return BadRequest(new { message = "Invalid password reset request." });
                }

                // Reset the password
                var result = await _signInManager.UserManager.ResetPasswordAsync(user, resetPasswordDto.Token, resetPasswordDto.NewPassword);
                
                if (!result.Succeeded)
                {
                    var errors = result.Errors.Select(e => e.Description).ToList();
                    return BadRequest(new { message = "Password reset failed.", errors });
                }

                // Optionally, you might want to sign out all existing sessions
                await _signInManager.UserManager.UpdateSecurityStampAsync(user);

                Serilog.Log.Information("Password reset successfully for user: {Email}", resetPasswordDto.Email);
                
                return Ok(new { message = "Password has been reset successfully. You can now log in with your new password." });
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex, "Error resetting password for user: {Email}", resetPasswordDto.Email);
                return StatusCode(500, "Internal server error");
            }
        }
    }
}