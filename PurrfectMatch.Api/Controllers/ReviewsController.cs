using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PurrfectMatch.Application.Managers;
using PurrfectMatch.Shared.DTOs.Reviews;
using System.Security.Claims;

namespace PurrfectMatch.Api.Controllers
{
    public class ReviewsController : BaseApiController
    {
        private readonly ReviewsManager _reviewsManager;        public ReviewsController(ReviewsManager reviewsManager)
        {
            _reviewsManager = reviewsManager;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateReview([FromBody] CreateReviewDto createReviewDto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            // Log for debugging
            Serilog.Log.Information("CreateReview - UserId from claims: {UserId}", userId);

            try
            {
                var review = await _reviewsManager.CreateReviewAsync(userId, createReviewDto);
                return CreatedAtAction(nameof(GetShelterReviews), new { shelterId = createReviewDto.ShelterId }, review);
            }            catch (InvalidOperationException ex)
            {
                Serilog.Log.Error("CreateReview InvalidOperationException: {Message}", ex.Message);
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex, "CreateReview Exception: {Message}", ex.Message);
                return StatusCode(500, new { message = "An error occurred while creating the review" });
            }
        }

        [HttpPut("{reviewId}")]
        [Authorize]
        public async Task<IActionResult> UpdateReview(int reviewId, [FromBody] UpdateReviewDto updateReviewDto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var review = await _reviewsManager.UpdateReviewAsync(reviewId, userId, updateReviewDto);
            if (review == null)
            {
                return NotFound();
            }            return Ok(review);
        }

        [HttpDelete("{reviewId}")]
        [Authorize]
        public async Task<IActionResult> DeleteReview(int reviewId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var result = await _reviewsManager.DeleteReviewAsync(reviewId, userId);
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpGet("shelters/{shelterId}")]
        public async Task<IActionResult> GetShelterReviews(int shelterId)
        {
            var reviews = await _reviewsManager.GetShelterReviewsAsync(shelterId);
            return Ok(reviews);
        }

        [HttpGet("users/{userId}")]
        public async Task<IActionResult> GetUserReviews(string userId)
        {
            var reviews = await _reviewsManager.GetUserReviewsAsync(userId);            return Ok(reviews);
        }

        [HttpGet("shelters/{shelterId}/users/{userId}")]
        public async Task<IActionResult> GetUserReviewForShelter(int shelterId, string userId)
        {
            // Add logging to debug the issue
            Serilog.Log.Information("GetUserReviewForShelter called with ShelterId: {ShelterId}, UserId: {UserId}", shelterId, userId);
            
            var review = await _reviewsManager.GetUserReviewForShelterAsync(userId, shelterId);
            
            // Return 200 with null instead of 404 when no review is found
            // This allows the frontend to handle the case where a user hasn't reviewed a shelter yet
            Serilog.Log.Information("Review found: {ReviewFound} for user {UserId} and shelter {ShelterId}", review != null, userId, shelterId);
            return Ok(review);
        }        [HttpGet("shelters/{shelterId}/average-rating")]
        public async Task<IActionResult> GetShelterAverageRating(int shelterId)
        {
            var averageRating = await _reviewsManager.GetShelterAverageRatingAsync(shelterId);
            var count = await _reviewsManager.GetShelterReviewCountAsync(shelterId);
            return Ok(new { averageRating = averageRating, count = count });
        }

        [HttpGet("shelters/{shelterId}/count")]
        public async Task<IActionResult> GetShelterReviewCount(int shelterId)
        {
            var count = await _reviewsManager.GetShelterReviewCountAsync(shelterId);
            return Ok(new { Count = count });
        }
    }
}
