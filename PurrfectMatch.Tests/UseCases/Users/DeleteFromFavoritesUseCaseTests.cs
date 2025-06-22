using Moq;
using AutoMapper;
using PurrfectMatch.Application.Managers;
using PurrfectMatch.Application.Specifications.Favorites;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Domain.Interfaces.Services;
using PurrfectMatch.Shared.DTOs.Favorites;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace PurrfectMatch.Tests.UseCases.Users
{
    public class DeleteFromFavoritesUseCaseTests
    {
        [Fact]
        public async Task ExecuteAsync_ShouldReturnTrue_WhenFavoriteExists()
        {
            // Arrange
            var mockRepository = new Mock<IBaseRepository<Favorite>>();
            var favorite = new Favorite { FavoriteId = 1, UserId = "user1", PetId = 101 };
            var favorites = new List<Favorite> { favorite };

            mockRepository.Setup(repo => repo.ListAsync(It.IsAny<FavoritesFilterSpecification>()))
                          .ReturnsAsync(favorites);

            var usersManager = new UsersManager(mockRepository.Object, Mock.Of<IBaseRepository<Pet>>(), Mock.Of<IUserProfileRepository>(), Mock.Of<IBlobStorageService>(), Mock.Of<AutoMapper.IMapper>()
            );

            // Act
            var result = await usersManager.DeleteFromFavoritesAsync("user1", 101);

            // Assert
            Assert.True(result);
            mockRepository.Verify(repo => repo.Delete(favorite), Times.Once);
            mockRepository.Verify(repo => repo.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task ExecuteAsync_ShouldReturnFalse_WhenFavoriteDoesNotExist()
        {
            // Arrange
            var mockRepository = new Mock<IBaseRepository<Favorite>>();

            mockRepository.Setup(repo => repo.ListAsync(It.IsAny<FavoritesFilterSpecification>()))
                          .ReturnsAsync(new List<Favorite>());

            var usersManager = new UsersManager(mockRepository.Object, Mock.Of<IBaseRepository<Pet>>(), Mock.Of<IUserProfileRepository>(), Mock.Of<IBlobStorageService>(), Mock.Of<AutoMapper.IMapper>()
            );

            // Act
            var result = await usersManager.DeleteFromFavoritesAsync("user1", 101);

            // Assert
            Assert.False(result);
            mockRepository.Verify(repo => repo.Delete(It.IsAny<Favorite>()), Times.Never);
            mockRepository.Verify(repo => repo.SaveChangesAsync(), Times.Never);
        }
    }
}