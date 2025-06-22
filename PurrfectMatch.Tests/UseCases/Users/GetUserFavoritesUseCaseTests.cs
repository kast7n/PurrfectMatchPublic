using Moq;
using Xunit;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Shared.DTOs.Favorites;
using AutoMapper;
using PurrfectMatch.Domain.Interfaces.Services;
using PurrfectMatch.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;
using PurrfectMatch.Shared.DTOs.Users;
using PurrfectMatch.Domain.Interfaces.Specifications;
using PurrfectMatch.Application.Managers;

namespace PurrfectMatch.Tests.UseCases.Users
{
    public class GetUserFavoritesUseCaseTests
    {
        [Fact]
        public async Task ExecuteAsync_ShouldReturnFavorites_WhenUserExists()
        {
            // Arrange
            var userId = "test-user-id";
            var mockFavoritesRepository = new Mock<IBaseRepository<Favorite>>();
            var mockMapper = new Mock<IMapper>();
            var expectedFavorites = new List<FavoriteDto> { new FavoriteDto { Id = 1, userId = "test-user-id", PetId = 101, AddedAt = DateTime.UtcNow } };

            mockFavoritesRepository.Setup(repo => repo.ListAsync(It.IsAny<ISpecification<Favorite>>()))
                .ReturnsAsync(new List<Favorite> { new Favorite { FavoriteId = 1, UserId = "test-user-id", PetId = 101 } });

            mockMapper.Setup(mapper => mapper.Map<IEnumerable<FavoriteDto>>(It.IsAny<IEnumerable<Favorite>>()))
                .Returns(expectedFavorites);

            var usersManager = new UsersManager(mockFavoritesRepository.Object, Mock.Of<IBaseRepository<Pet>>(), Mock.Of<PurrfectMatch.Domain.Interfaces.IRepositories.IUserProfileRepository>(), Mock.Of<IBlobStorageService>(), mockMapper.Object
            );

            // Act
            var result = await usersManager.GetUserFavoritesAsync(userId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(expectedFavorites.Count, result.Count());
        }

        [Fact]
        public async Task ExecuteAsync_ShouldReturnEmptyList_WhenUserHasNoFavorites()
        {
            // Arrange
            var userId = "test-user-id";
            var mockFavoritesRepository = new Mock<IBaseRepository<Favorite>>();
            var mockMapper = new Mock<IMapper>();

            mockFavoritesRepository.Setup(repo => repo.ListAsync(It.IsAny<ISpecification<Favorite>>()))
                .ReturnsAsync(new List<Favorite>());

            mockMapper.Setup(mapper => mapper.Map<IEnumerable<FavoriteDto>>(It.IsAny<IEnumerable<Favorite>>()))
                .Returns(new List<FavoriteDto>());

            var usersManager = new UsersManager(mockFavoritesRepository.Object, Mock.Of<IBaseRepository<Pet>>(), Mock.Of<PurrfectMatch.Domain.Interfaces.IRepositories.IUserProfileRepository>(), Mock.Of<IBlobStorageService>(), mockMapper.Object
            );

            // Act
            var result = await usersManager.GetUserFavoritesAsync(userId);

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }
    }
}