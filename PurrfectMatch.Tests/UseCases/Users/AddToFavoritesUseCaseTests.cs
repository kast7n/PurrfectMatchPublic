using System;
using System.Threading.Tasks;
using AutoMapper;
using Moq;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Domain.Interfaces.Specifications;
using PurrfectMatch.Domain.Interfaces.Services;
using PurrfectMatch.Shared.DTOs.Favorites;
using PurrfectMatch.Shared.DTOs.Users;
using PurrfectMatch.Application.Managers;
using PurrfectMatch.Domain.Interfaces.IRepositories;
using Xunit;

namespace PurrfectMatch.Tests.UseCases.Users
{
    public class AddToFavoritesUseCaseTests
    {
        private readonly Mock<IBaseRepository<Favorite>> _mockFavoriteRepository;
        private readonly Mock<IBaseRepository<Pet>> _mockPetRepository;
        private readonly Mock<IUserProfileRepository> _mockUserProfileRepository;
        private readonly Mock<IMapper> _mockMapper;
        private readonly UsersManager _usersManager;

        public AddToFavoritesUseCaseTests()
        {
            _mockFavoriteRepository = new Mock<IBaseRepository<Favorite>>();
            _mockPetRepository = new Mock<IBaseRepository<Pet>>();
            _mockUserProfileRepository = new Mock<IUserProfileRepository>();
            _mockMapper = new Mock<IMapper>();            _usersManager = new UsersManager(
                _mockFavoriteRepository.Object,
                _mockPetRepository.Object,
                _mockUserProfileRepository.Object,
                Mock.Of<IBlobStorageService>(),
                _mockMapper.Object
            );
        }

        [Fact]
        public async Task ExecuteAsync_ShouldReturnFalse_WhenPetDoesNotExist()
        {
            // Arrange
            var dto = new AddToFavoritesDto { PetId = 1, userId = "user123" };
            _mockPetRepository.Setup(repo => repo.GetAsync(dto.PetId)).ReturnsAsync((Pet?)null);

            // Act
            var result = await _usersManager.AddToFavoritesAsync(dto);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task ExecuteAsync_ShouldReturnTrue_WhenAlreadyFavorited()
        {
            // Arrange
            var dto = new AddToFavoritesDto { PetId = 1, userId = "user123" };
            _mockPetRepository.Setup(repo => repo.GetAsync(dto.PetId)).ReturnsAsync(new Pet());
            _mockFavoriteRepository.Setup(repo => repo.ListAsync(It.IsAny<ISpecification<Favorite>>())).ReturnsAsync(new[] { new Favorite() });

            // Act
            var result = await _usersManager.AddToFavoritesAsync(dto);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task ExecuteAsync_ShouldAddFavorite_WhenNotAlreadyFavorited()
        {
            // Arrange
            var dto = new AddToFavoritesDto { PetId = 1, userId = "user123" };
            var favorite = new Favorite();

            _mockPetRepository.Setup(repo => repo.GetAsync(dto.PetId)).ReturnsAsync(new Pet());
            _mockFavoriteRepository.Setup(repo => repo.ListAsync(It.IsAny<ISpecification<Favorite>>())).ReturnsAsync(Array.Empty<Favorite>());
            _mockMapper.Setup(mapper => mapper.Map<Favorite>(dto)).Returns(favorite);

            // Act
            var result = await _usersManager.AddToFavoritesAsync(dto);

            // Assert
            Assert.True(result);
            _mockFavoriteRepository.Verify(repo => repo.CreateAsync(favorite), Times.Once);
            _mockFavoriteRepository.Verify(repo => repo.SaveChangesAsync(), Times.Once);
        }
    }
}