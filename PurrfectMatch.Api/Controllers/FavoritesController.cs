using Microsoft.AspNetCore.Mvc;
using PurrfectMatch.Application.Managers;
using PurrfectMatch.Shared.DTOs.Users;
using System.Threading.Tasks;

namespace PurrfectMatch.Api.Controllers;

[ApiController]
[Route("api/users/{userId}/favorites")]
public class FavoritesController : BaseApiController
{
    private readonly UsersManager _usersManager;

    public FavoritesController(UsersManager usersManager)
    {
        _usersManager = usersManager;
    }

    [HttpPost]
    public async Task<IActionResult> AddToFavorites(string userId, [FromBody] AddToFavoritesDto addToFavoritesDto)
    {
        if (!ModelState.IsValid || userId != addToFavoritesDto.userId)
        {
            return BadRequest(ModelState);
        }

        var success = await _usersManager.AddToFavoritesAsync(addToFavoritesDto);
        if (!success)
        {
            return BadRequest("Failed to add pet to favorites.");
        }
        return Ok();
    }

    [HttpGet]
    public async Task<IActionResult> GetUserFavorites(string userId)
    {
        var favorites = await _usersManager.GetUserFavoritesAsync(userId);
        return Ok(favorites);
    }

    [HttpDelete("{petId}")]
    public async Task<IActionResult> DeleteFromFavorites(string userId, int petId)
    {
        var success = await _usersManager.DeleteFromFavoritesAsync(userId, petId);
        if (!success)
        {
            return NotFound("Favorite not found.");
        }
        return NoContent();
    }
}