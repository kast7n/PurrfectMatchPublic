using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Shared.DTOs.Reviews;

namespace PurrfectMatch.Application.Managers
{
    public class ReviewsManager
    {
        private readonly IReviewRepository _reviewRepository;
        private readonly UserManager<User> _userManager;
        private readonly IBaseRepository<Shelter> _shelterRepository;
        private readonly IMapper _mapper;

        public ReviewsManager(
            IReviewRepository reviewRepository,
            UserManager<User> userManager,
            IBaseRepository<Shelter> shelterRepository,
            IMapper mapper)
        {
            _reviewRepository = reviewRepository;
            _userManager = userManager;
            _shelterRepository = shelterRepository;
            _mapper = mapper;
        }        public async Task<ReviewDto> CreateReviewAsync(string userId, CreateReviewDto createReviewDto)
        {
            // Verify the user exists
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new InvalidOperationException($"User with ID {userId} not found");
            }

            // Check if user already has a review for this shelter
            var existingReviews = await _reviewRepository.GetShelterReviewsAsync(createReviewDto.ShelterId);
            var existingReview = existingReviews.FirstOrDefault(r => r.UserId == userId);
            
            if (existingReview != null)
            {
                throw new InvalidOperationException("User has already reviewed this shelter");
            }

            var review = new Review
            {
                UserId = userId,
                ShelterId = createReviewDto.ShelterId,
                Rating = createReviewDto.Rating,
                Comment = createReviewDto.Comment,
                CreatedAt = DateTime.UtcNow
            };

            await _reviewRepository.CreateAsync(review);
            await _reviewRepository.SaveChangesAsync();

            return await MapToReviewDtoAsync(review);
        }

        public async Task<ReviewDto?> UpdateReviewAsync(int reviewId, string userId, UpdateReviewDto updateReviewDto)
        {
            var review = await _reviewRepository.GetAsync(reviewId);
            if (review == null || review.UserId != userId)
            {
                return null;
            }

            review.Rating = updateReviewDto.Rating;
            review.Comment = updateReviewDto.Comment;

            _reviewRepository.Update(review);
            await _reviewRepository.SaveChangesAsync();

            return await MapToReviewDtoAsync(review);
        }

        public async Task<bool> DeleteReviewAsync(int reviewId, string userId)
        {
            var review = await _reviewRepository.GetAsync(reviewId);
            if (review == null || review.UserId != userId)
            {
                return false;
            }

            _reviewRepository.Delete(review);
            await _reviewRepository.SaveChangesAsync();
            return true;
        }

        public async Task<IReadOnlyList<ReviewDto>> GetShelterReviewsAsync(int shelterId)
        {
            var reviews = await _reviewRepository.GetShelterReviewsAsync(shelterId);
            var reviewDtos = new List<ReviewDto>();

            foreach (var review in reviews)
            {
                reviewDtos.Add(await MapToReviewDtoAsync(review));
            }

            return reviewDtos;
        }

        public async Task<IReadOnlyList<ReviewDto>> GetUserReviewsAsync(string userId)
        {
            var reviews = await _reviewRepository.GetUserReviewsAsync(userId);
            var reviewDtos = new List<ReviewDto>();

            foreach (var review in reviews)
            {
                reviewDtos.Add(await MapToReviewDtoAsync(review));
            }

            return reviewDtos;
        }        public async Task<ReviewDto?> GetUserReviewForShelterAsync(string userId, int shelterId)
        {
            var reviews = await _reviewRepository.GetShelterReviewsAsync(shelterId);
            var userReview = reviews.FirstOrDefault(r => r.UserId == userId);
            
            if (userReview == null)
            {
                return null;
            }

            return await MapToReviewDtoAsync(userReview);
        }

        public async Task<decimal> GetShelterAverageRatingAsync(int shelterId)
        {
            var reviews = await _reviewRepository.GetShelterReviewsAsync(shelterId);
            if (!reviews.Any())
            {
                return 0;
            }

            return (decimal)reviews.Average(r => r.Rating);
        }

        public async Task<int> GetShelterReviewCountAsync(int shelterId)
        {
            var reviews = await _reviewRepository.GetShelterReviewsAsync(shelterId);
            return reviews.Count;
        }        private async Task<ReviewDto> MapToReviewDtoAsync(Review review)
        {
            var user = await _userManager.FindByIdAsync(review.UserId);
            var shelter = await _shelterRepository.GetAsync(review.ShelterId);

            return new ReviewDto
            {
                ReviewId = review.ReviewId,
                UserId = review.UserId,
                UserName = user?.UserName ?? "Unknown User",
                ShelterId = review.ShelterId,
                ShelterName = shelter?.Name ?? "Unknown Shelter",
                Rating = review.Rating,
                Comment = review.Comment,
                CreatedAt = review.CreatedAt
            };
        }
    }
}
